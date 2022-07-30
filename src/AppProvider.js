import React, { createContext, useEffect, useReducer } from 'react';
import isNil from 'lodash/isNil';
import ThemeProvider from './component-library/Theme/ThemeProvider';
import RoutesProvider from './routes/RoutesProvider';
import * as splash from './utils/splash';
import useWallets from './hooks/useWallets';
import LockedPage from './pages/Lock/LockedPage';
import InactivityCheck from './features/InactivityCheck/InactivityCheck';
import GlobalError from './features/ErrorHandler/GlobalError';
import useTranslations from './hooks/useTranslations';

export const AppContext = createContext([]);

const ACTIONS = {
  ADD_WALLET: 'addWallet',
  CHANGE_WALLET: 'changeWallet',
  SET_LOGGEDIN: 'setLoggedIn',
  INITIATE_DONE: 'initiateDone',
  HIDE_BALANCE: 'hideBalance',
  SHOW_BALANCE: 'showBalance',
  LOGOUT: 'logout',
};

const initialState = {
  isLogged: false,
  ready: false,
  hiddenBalance: false,
  addressBook: [
    {
      name: 'TEST 1',
      address: 'MjMRoC8j1P2732DapDq6SjzhJ7kq2p',
      chain: 'SOLANA',
    },
    {
      name: 'TEST 2',
      address: 'LjMRoC8j1P2732DapDq6SjzhJ7kq2p',
      chain: 'SOLANA',
    },
  ],
  isExtension: process.env.REACT_APP_IS_EXTENSION || false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOGGEDIN:
      return { ...state, isLogged: action.value };
    case ACTIONS.INITIATE_DONE:
      return { ...state, ...action.value, ready: true };
    case ACTIONS.LOGOUT:
      return { ...state, ready: true };
    case ACTIONS.HIDE_BALANCE:
      return { ...state, hiddenBalance: true };
    case ACTIONS.SHOW_BALANCE:
      return { ...state, hiddenBalance: false };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [walletState, walletActions] = useWallets();
  const {
    selected: selectedLanguage,
    loaded: translationsLoaded,
    languages,
    changeLanguage,
  } = useTranslations();
  const [appState, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (walletState.ready && !appState.ready && translationsLoaded) {
      splash.hide();
      dispatch({
        type: ACTIONS.INITIATE_DONE,
        value: { isLogged: !isNil(walletState.active) },
      });
    }
  }, [
    walletState.ready,
    walletState.active,
    appState.ready,
    translationsLoaded,
  ]);
  const logout = async () => {
    await walletActions.removeAllWallets();
    dispatch({
      type: ACTIONS.LOGOUT,
    });
  };
  const toggleHideBalance = () => {
    dispatch({
      type: appState.hiddenBalance
        ? ACTIONS.SHOW_BALANCE
        : ACTIONS.HIDE_BALANCE,
    });
  };
  const appActions = {
    ...walletActions,
    changeLanguage,
    logout,
    toggleHideBalance,
  };

  return (
    <AppContext.Provider
      value={[
        { ...appState, ...walletState, languages, selectedLanguage },
        appActions,
      ]}>
      <GlobalError>
        {appState.ready && !walletState.locked && (
          <RoutesProvider>
            <ThemeProvider>
              <InactivityCheck
                onIdle={walletActions.lockWallets}
                active={walletState.requiredLock}>
                {children}
              </InactivityCheck>
            </ThemeProvider>
          </RoutesProvider>
        )}
        {walletState.locked && (
          <ThemeProvider>
            <LockedPage />
          </ThemeProvider>
        )}
      </GlobalError>
    </AppContext.Provider>
  );
};

export default AppProvider;
