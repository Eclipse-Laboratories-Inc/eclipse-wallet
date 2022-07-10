import WalletOverview from './WalletOverviewPage';
import NtfsPage from './NtfsPage';
import SwapPage from './SwapPage';
import TransactionsPage from './TransactionsPage';
import SettingsPage from '../Settings/SettingsPage';

import IconWallet from '../../assets/images/IconWallet.png';
import IconNFT from '../../assets/images/IconNFT.png';
import IconSwap from '../../assets/images/IconSwap.png';
import IconBalance from '../../assets/images/IconBalance.png';
import IconSettings from '../../assets/images/IconSettings.png';

export const ROUTES_MAP = {
  WALLET_OVERVIEW: 'WALLET_OVERVIEW',
  WALLET_NTFS: 'WALLET_NTFS',
  WALLET_SWAP: 'WALLET_SWAP',
  WALLET_TRANSACTIONS: 'WALLET_TRANSACTIONS',
  WALLET_SETTINGS: 'WALLET_SETTINGS',
  LOCK_SCREEN: 'LOCK_SCREEN',
};

const routes = [
  {
    key: ROUTES_MAP.WALLET_OVERVIEW,
    name: 'Wallet',
    path: '',
    route: '/wallet',
    Component: WalletOverview,
    default: true,
    icon: IconWallet,
  },
  {
    key: ROUTES_MAP.WALLET_NTFS,
    name: 'NFT',
    path: 'ntfs',
    route: '/wallet/ntfs',
    Component: NtfsPage,
    default: false,
    icon: IconNFT,
  },
  {
    key: ROUTES_MAP.WALLET_SWAP,
    name: 'Swap',
    path: 'swap',
    route: '/wallet/swap',
    Component: SwapPage,
    default: false,
    icon: IconSwap,
  },
  {
    key: ROUTES_MAP.WALLET_TRANSACTIONS,
    name: 'Transactions',
    path: 'transactions',
    route: '/wallet/transactions',
    Component: TransactionsPage,
    default: false,
    icon: IconBalance,
  },
  {
    key: ROUTES_MAP.WALLET_SETTINGS,
    name: 'Settings',
    path: 'settings/*',
    route: '/wallet/settings',
    Component: SettingsPage,
    default: false,
    icon: IconSettings,
  },
  // {
  //   key: ROUTES_MAP.LOCK_SCREEN,
  //   name: 'Lock',
  //   path: 'lock',
  //   route: '/wallet/lock',
  //   Component: LockedPage,
  //   default: false,
  // },
];

export default routes;
