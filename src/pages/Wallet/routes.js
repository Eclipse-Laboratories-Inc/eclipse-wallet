import WalletOverview from './WalletOverviewPage';
import NftsPage from './NftsPage';
import SwapPage from './SwapPage';
import TransactionsPage from '../Transactions/TransactionsPage';
import SettingsPage from '../Settings/SettingsPage';

import IconWallet from '../../assets/images/IconWallet.png';
import IconNFT from '../../assets/images/IconNFT.png';
import IconSwap from '../../assets/images/IconSwap.png';
import IconBalance from '../../assets/images/IconBalance.png';
import IconSettings from '../../assets/images/IconSettings.png';

export const ROUTES_MAP = {
  WALLET_OVERVIEW: 'WALLET_OVERVIEW',
  WALLET_NFTS: 'WALLET_NFTS',
  WALLET_SWAP: 'WALLET_SWAP',
  WALLET_TRANSACTIONS: 'WALLET_TRANSACTIONS',
  WALLET_SETTINGS: 'WALLET_SETTINGS',
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
    key: ROUTES_MAP.WALLET_NFTS,
    name: 'NFT',
    path: 'nfts',
    route: '/wallet/nfts',
    Component: NftsPage,
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
    path: 'transactions/*',
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
];

export default routes;
