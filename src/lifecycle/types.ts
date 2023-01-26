import { ApiPromise } from '@polkadot/api';
import { Network } from '../network';
import {
  AccountVote,
  Referendum,
  ReferendumDetails,
  Track,
  Voting,
} from '../types';

export type Address = string;

export type ChainState = {
  tracks: Map<number, Track>;
  referenda: Map<number, Referendum>;
  allVotings: Map<Address, Map<number, Voting>>;
};

export type PersistedDataContext = {
  votes: Map<number, AccountVote>;
};

export type Warning = {
  type: 'Warning';
  message: string;
};

export type Error = {
  type: 'Error';
  message: string;
};

export type Report = Warning | Error;

// States

type BaseState = {
  reports?: Report[];
  connectedAccount: string | null;
  connectivity: Connectivity;
};

type BaseRestoredState = BaseState &
  PersistedDataContext & {
    db: IDBDatabase;
    network: Network;
  };

export type InitialState = BaseState & {
  type: 'InitialState';
};

export type RestoredState = BaseRestoredState & {
  type: 'RestoredState';
};

export type ConnectedState = BaseRestoredState & {
  type: 'ConnectedState';
  block: number;
  chain: ChainState;
  details: Map<number, ReferendumDetails>;
};

export type State = InitialState | RestoredState | ConnectedState;

// Actions

export type NewReportAction = {
  type: 'NewReportAction';
  report: Report;
};

export type SetRestoredAction = PersistedDataContext & {
  type: 'SetRestoredAction';
  db: IDBDatabase;
  network: Network;
};

export type SetConnectedAccountAction = {
  type: 'SetConnectedAccountAction';
  connectedAccount: Address | null;
};

export type UpdateConnectivityAction = {
  type: 'UpdateConnectivityAction';
  connectivity: Connectivity;
};

export type NewFinalizedBlockAction = BaseConnected & {
  type: 'NewFinalizedBlockAction';
  block: number;
  chain: ChainState;
};

export type StoreReferendumDetailsAction = {
  type: 'StoreReferendumDetailsAction';
  details: Map<number, ReferendumDetails>;
};

type Offline = {
  type: 'Offline';
};

type Online = {
  type: 'Online';
};

type BaseConnected = {
  api: ApiPromise;
  endpoints: string[];
};

type Connected = BaseConnected & {
  type: 'Connected';
};

type Following = BaseConnected & {
  type: 'Following';
};

export type Connectivity = Offline | Online | Connected | Following;

export function apiFromConnectivity(
  connectivity: Connectivity
): ApiPromise | null {
  const { type } = connectivity;
  if (type == 'Connected' || type == 'Following') {
    return connectivity.api;
  }
  return null;
}

export type CastVoteAction = {
  type: 'CastVoteAction';
  index: number;
  vote: AccountVote;
};

export type Action =
  | NewReportAction
  | SetConnectedAccountAction
  | SetRestoredAction
  | UpdateConnectivityAction
  | NewFinalizedBlockAction
  | StoreReferendumDetailsAction
  | CastVoteAction;
