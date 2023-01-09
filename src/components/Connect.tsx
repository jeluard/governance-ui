import { BaseWallet } from '@polkadot-onboard/core';
import { useEffect, useState } from 'react';
import { Button, Modal } from './common';
import { useAccount, useWallets } from '../contexts';
import type { SigningAccount } from '../contexts/Account';
import { WalletState } from '../contexts/Wallets';
import Account from './Account';
import Wallet from './Wallet';

export interface IWalletsListProps {
  wallets: Array<BaseWallet>;
  walletState: Map<string, WalletState>;
  walletConnectHandler: (wallet: BaseWallet) => void;
}

const WalletsList = ({
  wallets,
  walletState,
  walletConnectHandler,
}: IWalletsListProps) => {
  return (
    <div>
      {wallets?.map((wallet, index) => {
        const name = wallet?.metadata.title;
        const iconUrl = wallet?.metadata.iconUrl;
        const state = walletState.get(wallet?.metadata.title) || 'disconnected';
        return (
          <Wallet
            key={index}
            name={name}
            state={state}
            clickHandler={() => walletConnectHandler(wallet)}
            iconUrl={iconUrl}
          />
        );
      })}
    </div>
  );
};

export interface IAccountListProps {
  accounts: Map<string, SigningAccount>;
  connectedAccount: SigningAccount | undefined;
  accountConnectHandler: (account: SigningAccount) => void;
}

const AccountList = ({
  accounts,
  connectedAccount,
  accountConnectHandler,
}: IAccountListProps) => {
  return (
    <div>
      {[...accounts.entries()].map(([key, signingAccount]) => {
        const { account } = signingAccount;
        const isConnected =
          !!connectedAccount &&
          connectedAccount.account.address === account.address;
        return (
          <Account
            key={key}
            name={account.name || ''}
            address={account.address}
            state={{ isConnected }}
            clickHandler={() => accountConnectHandler(signingAccount)}
          />
        );
      })}
    </div>
  );
};

type ConnectViews = 'wallets' | 'accounts';

const ConnectButton = (props) => {
  const [visible, setVisible] = useState(false);
  const [currentView, setCurrentView] = useState<ConnectViews>();
  const { wallets, walletState, setWalletState } = useWallets();
  const { connectedAccount, setConnectedAccount, walletsAccounts } =
    useAccount();

  const loadedAccountsCount = walletsAccounts ? walletsAccounts.size : 0;

  const initialView: ConnectViews =
    loadedAccountsCount > 0 ? 'accounts' : 'wallets';

  const toggleView = () => {
    setCurrentView((oldView) =>
      oldView === 'wallets' ? 'accounts' : 'wallets'
    );
  };
  const walletConnectHandler = async (wallet: BaseWallet) => {
    if (walletState.get(wallet?.metadata.title) == 'connected') {
      await wallet.disconnect();
      setWalletState(wallet?.metadata.title, 'disconnected');
    } else {
      await wallet.connect();
      setWalletState(wallet?.metadata.title, 'connected');
    }
  };
  const accountConnectHandler = async (signingAccount: SigningAccount) => {
    setConnectedAccount(signingAccount);
    closeModal();
  };
  const closeModal = () => {
    setVisible(false);
  };
  const openModal = () => {
    setCurrentView(initialView);
    setVisible(true);
  };
  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);
  const onPress = () => openModal();
  return (
    <>
      <Button label="connect" {...{ ...props, onPress }}>
        {connectedAccount
          ? `Connected - ${connectedAccount.account.name}`
          : 'Connect'}
      </Button>
      <Modal visible={visible} width={600} onClose={() => closeModal()}>
        <div onClick={() => toggleView()}>{`${
          currentView === 'accounts'
            ? '< wallets'
            : loadedAccountsCount
            ? 'accounts >'
            : ''
        }`}</div>
        {currentView === 'accounts' && (
          <AccountList
            accounts={walletsAccounts}
            connectedAccount={connectedAccount}
            accountConnectHandler={accountConnectHandler}
          />
        )}
        {currentView === 'wallets' && (
          <WalletsList
            wallets={wallets}
            walletState={walletState}
            walletConnectHandler={walletConnectHandler}
          />
        )}
      </Modal>
    </>
  );
};

export default ConnectButton;
