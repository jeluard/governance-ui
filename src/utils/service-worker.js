import {
  areNotificationsGranted,
  isPeriodicBackgroundSyncGranted,
} from './permissions';

export async function registerServiceWorker() {
  const reg = await navigator.serviceWorker.register(
    new URL('../service-worker.js', import.meta.url),
    {
      type: 'module',
    }
  );

  // Wait for the service worker to be ready
  await navigator.serviceWorker.ready;

  try {
    if (isPeriodicBackgroundSyncGranted()) {
      await reg.periodicSync.register('fetch-referenda-updates', {
        minInterval: 24 * 60 * 60 * 1000, // 1 day
      });
    } else {
      console.warn('Permission to register a periodicSync denied');
    }
  } catch {
    console.warn('Periodic Sync could not be registered!');
  }

  try {
    // Request user to grant notifications request if necessary
    if (!areNotificationsGranted()) {
      await Notification.requestPermission();
    }
  } catch (e) {
    console.warn(e);
  }

  reg.addEventListener('updatefound', () => {
    // A wild service worker has appeared in reg.installing!
    const newWorker = reg.installing;

    if (newWorker) {
      newWorker.state;
      // "installing" - the install event has fired, but not yet complete
      // "installed"  - install complete
      // "activating" - the activate event has fired, but not yet complete
      // "activated"  - fully active
      // "redundant"  - discarded. Either failed install, or it's been
      //                replaced by a newer version

      newWorker.addEventListener('statechange', () => {
        // newWorker.state has changed
      });
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // This fires when the service worker controlling this page
    // changes, eg a new worker has skipped waiting and become
    // the new active worker.
    console.log('New ServiceWorker has been activated');
  });

  navigator.serviceWorker.addEventListener('message', () => {
    console.log('New message');
  });

  navigator.serviceWorker.addEventListener('messageerror', () => {
    console.log('New message error');
  });

  window.addEventListener('beforeinstallprompt', () => {
    // This fires when the service worker controlling this page
    // changes, eg a new worker has skipped waiting and become
    // the new active worker.
    console.log('About to be installed');
  });

  window.addEventListener('appinstalled', () => {
    // This fires when the app has been installed
    console.log('App installed');
  });
}
