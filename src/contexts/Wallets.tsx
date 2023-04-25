import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletAggregator, BaseWallet } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import {
  PolkadotWalletsContextProvider,
  useWallets as _useWallets,
} from '@polkadot-onboard/react';

const APP_NAME = 'Governance UI';

export type WalletState = 'connected' | 'disconnected';
export interface IWalletContext {
  wallets: Array<BaseWallet>;
  walletState: Map<string, WalletState>;
  setWalletState: (title: string, state: WalletState) => void;
}

const WalletContext = createContext({} as IWalletContext);
export const useWallets = () => useContext<IWalletContext>(WalletContext);

/**
 * Provides a local storage utility class to store the connection state of each wallet.
 * WalletState can be :'connected' | 'disconnected'
 * the state is stored in localStorage under `wallet#<walletTitle>`
 * e.g. 'wallet#polkadot-js' is the key for polkadot-js extension wallet
 */
export class WalletStateStorage {
  static getStateStorageKey(walletTitle: string) {
    return `wallet#${walletTitle}`;
  }
  static set(walletTitle: string, state: WalletState) {
    const sKey = this.getStateStorageKey(walletTitle);
    localStorage.setItem(sKey, state);
  }
  static get(walletTitle: string) {
    const sKey = this.getStateStorageKey(walletTitle);
    return localStorage.getItem(sKey);
  }
}

const WalletProviderInner = ({ children }: { children: React.ReactNode }) => {
  const { wallets } = _useWallets();
  const [walletState, _setWalletState] = useState<Map<string, WalletState>>(
    new Map<string, WalletState>()
  );
  const setWalletState = (title: string, state: WalletState) => {
    _setWalletState(
      (oldState) => new Map<string, WalletState>([...oldState, [title, state]])
    );
    WalletStateStorage.set(title, state);
  };

  const initiateWallets = async (wallets: Array<BaseWallet>) => {
    const walletState: Map<string, WalletState> = new Map<
      string,
      WalletState
    >();
    for (const wallet of wallets) {
      const title = wallet.metadata?.title;
      if (title) {
        const state = WalletStateStorage.get(title);
        if (state === 'connected') {
          await wallet.connect();
          walletState.set(title, 'connected');
        }
      }
    }
    _setWalletState(walletState);
  };

  useEffect(() => {
    if (wallets) {
      initiateWallets(wallets);
    }
  }, [wallets]);
  return (
    <WalletContext.Provider
      value={{ wallets: wallets || [], walletState, setWalletState }}
    >
      {children}
    </WalletContext.Provider>
  );
};

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const walletAggregator = new WalletAggregator([
    new InjectedWalletProvider({}, APP_NAME),
  ]);
  return (
    <PolkadotWalletsContextProvider
      walletAggregator={walletAggregator}
      initialWaitMs={20}
    >
      <WalletProviderInner>{children}</WalletProviderInner>
    </PolkadotWalletsContextProvider>
  );
};

export default WalletProvider;
