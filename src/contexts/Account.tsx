import type { SigningAccount } from '../types';

import React, { useContext, createContext, useState, useEffect } from 'react';
import { useAppLifeCycle } from '../lifecycle/index.js';
import { useWallets } from './Wallets.js';

export interface IAccountContext {
  connectedAccount: SigningAccount | undefined;
  walletsAccounts: Map<string, SigningAccount>;
  setConnectedAccount: (signingAccount: SigningAccount | undefined) => void;
}
// account context
const accountContext = createContext({} as IAccountContext);
export const useAccount = () => useContext(accountContext);

/**
 * Provides a local storage utility class to store the connected account address.
 */
export class AccountStorage {
  static CONNECTED_ADRR_STORAGE_KEY = 'connectedAddress';
  static getConnectedAddress = () =>
    localStorage.getItem(this.CONNECTED_ADRR_STORAGE_KEY);
  static setConnectedAddress = (address: string) =>
    localStorage.setItem(this.CONNECTED_ADRR_STORAGE_KEY, address);
}

const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const { updater } = useAppLifeCycle();
  const [_connectedAccount, _setConnectedAccount] = useState<
    SigningAccount | undefined
  >();
  const { wallets, walletState } = useWallets();
  const [walletsAccounts, setWalletsAccounts] = useState<
    Map<string, SigningAccount>
  >(new Map<string, SigningAccount>());

  const loadConnectedAccount = async (): Promise<
    SigningAccount | undefined
  > => {
    const walletsAccounts = await getWalletsAccounts();
    let connectedAccount;
    const connectedAddress = AccountStorage.getConnectedAddress();
    if (connectedAddress) {
      connectedAccount = walletsAccounts.get(connectedAddress);
    }
    return connectedAccount;
  };

  const getWalletsAccounts = async () => {
    let signingAccounts = new Map<string, SigningAccount>();
    for (const wallet of wallets) {
      const {
        signer,
        metadata: { title },
      } = wallet;
      if (signer && walletState.get(title) === 'connected') {
        const walletSigningAccounts = new Map<string, SigningAccount>();
        const accounts = await wallet.getAccounts();
        if (accounts.length > 0) {
          for (const account of accounts) {
            walletSigningAccounts.set(account.address, {
              account,
              signer,
              sourceMetadata: wallet.metadata,
            });
          }
          signingAccounts = new Map([
            ...signingAccounts,
            ...walletSigningAccounts,
          ]);
        }
      }
    }
    return signingAccounts;
  };

  const accountSourceIsConnected = (signingAccount: SigningAccount) => {
    const {
      sourceMetadata: { title },
    } = signingAccount;
    return walletState.get(title) === 'connected';
  };

  const setConnectedAccount = (signingAccount: SigningAccount | undefined) => {
    const connectedAddress = signingAccount?.account.address;
    AccountStorage.setConnectedAddress(connectedAddress || '');
    _setConnectedAccount(signingAccount);
    updater.setConnectedAddress(connectedAddress || null);
  };

  // load connected account from storage
  const storedConnectedAddress = AccountStorage.getConnectedAddress();
  useEffect(() => {
    if (storedConnectedAddress) {
      loadConnectedAccount().then((signingAccount) => {
        if (signingAccount) {
          setConnectedAccount(signingAccount);
        }
      });
    }
  }, [storedConnectedAddress, walletsAccounts]);

  // load accounts from connected wallets
  useEffect(() => {
    getWalletsAccounts().then((accounts: Map<string, SigningAccount>) => {
      setWalletsAccounts(accounts);
    });
  }, [wallets, walletState]);

  const connectedAccount =
    _connectedAccount && accountSourceIsConnected(_connectedAccount)
      ? _connectedAccount
      : undefined;
  return (
    <accountContext.Provider
      value={{
        connectedAccount,
        setConnectedAccount,
        walletsAccounts,
      }}
    >
      {children}
    </accountContext.Provider>
  );
};

export default AccountProvider;
