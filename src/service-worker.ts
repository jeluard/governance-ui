import { manifest, version } from '@parcel/service-worker';
import {
  DB_NAME,
  DB_VERSION,
  STORES,
  VOTE_STORE_NAME,
  filterOngoingReferenda,
  filterToBeVotedReferenda,
  fetchChainState,
  CHAINSTATE_STORE_NAME,
} from './chainstate';
import { DEFAULT_NETWORK, endpointsFor } from './network';
import { AccountVote, Referendum } from './types';
import { all, latest, open, save } from './utils/indexeddb';
import { newApi } from './utils/polkadot-api';
import { REFERENDA_UPDATES_TAG } from './utils/service-worker';

const ASSETS_CACHE = `assets-version-${version}`;
const ALL_CACHES = [ASSETS_CACHE];

async function install() {
  // Cache all assets
  const cache = await caches.open(ASSETS_CACHE);
  await cache.addAll(manifest);
}

// First entry point, only called once per service worker version
// See https://web.dev/service-worker-lifecycle/
addEventListener('install', (e) => {
  // Use latest version right away, even if some clients are using an older version
  self.skipWaiting();

  e.waitUntil(install());
});

async function activate() {
  // Delete older caches
  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => !ALL_CACHES.includes(key) && caches.delete(key))
  );
}

self.addEventListener('activate', (e: ExtendableEvent) => {
  e.waitUntil(activate());
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  if (url.origin == location.origin && manifest.includes(url.pathname)) {
    // Only consider cached assets
    event.respondWith(
      caches.open(ASSETS_CACHE).then((cache) => {
        return cache.match(event.request).then(async (response) => {
          if (response) {
            return response;
          } else {
            // This should never happen
            const responseFromNetwork = await fetch(event.request);
            cache.put(event.request, responseFromNetwork.clone());
            return responseFromNetwork;
          }
        });
      })
    );
  }
});

// Fired when user clicks on a notification
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const scope = self.registration.scope;
  //const action = event.action; // Identify if the user clicked on the notification itself or on one action

  // Open window
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then((allClients) => {
        const client = allClients.find((client) => client.url == scope);
        if (client) {
          // Focus on a matching hidden window
          return client.focus();
        } else {
          // Otherwise open a new window
          return clients.openWindow(scope);
        }
      })
  );
});

function showNotification(referenda: Map<number, Referendum>) {
  self.registration.showNotification('Referenda', {
    body: `${referenda.size} new referenda to be voted on`,
    icon: '../assets/icons/icon-192x192.png',
    tag: 'referenda-updates',
    requireInteraction: true,
    data: { referenda },
  });
}

self.addEventListener('periodicsync', async (event: SyncEvent) => {
  if (event.tag === REFERENDA_UPDATES_TAG) {
    // Retrieve referenda updates
    const api = await newApi(endpointsFor(DEFAULT_NETWORK)); // TODO go through all user accessed networks
    const db = await open(DB_NAME, STORES, DB_VERSION);
    const number = await (await api.query.system.number()).toNumber();

    const latestChainstate = await latest(db, CHAINSTATE_STORE_NAME);
    if (latestChainstate) {
      if (number <= latestChainstate.key) {
        // No chain progress, skip block
        return;
      }
    }

    const hash = await api.rpc.chain.getBlockHash(number);
    const apiAt = await api.at(hash);
    const chain = await fetchChainState(apiAt);

    // Store chainstate for latest block
    await save(db, CHAINSTATE_STORE_NAME, number, chain);

    const ongoingReferenda = filterOngoingReferenda(chain.referenda);
    const votes = (await all<AccountVote>(db, VOTE_STORE_NAME)) as Map<
      number,
      AccountVote
    >;
    const referendaToBeVotedOn = filterToBeVotedReferenda(
      ongoingReferenda,
      votes
    );
    if (referendaToBeVotedOn.size > 0) {
      showNotification(referendaToBeVotedOn);
    }
  }
});
