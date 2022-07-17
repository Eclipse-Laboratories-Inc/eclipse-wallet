import React, { createContext, useEffect, useReducer } from 'react';
import isNil from 'lodash/isNil';
import ThemeProvider from './component-library/Theme/ThemeProvider';
import RoutesProvider from './routes/RoutesProvider';
import * as splash from './utils/splash';
import ENDPOINTS from './config/endpoints';
import useWallets from './hooks/useWallets';
import LockedPage from './pages/Lock/LockedPage';
import InactivityCheck from './features/InactivityCheck/InactivityCheck';

export const AppContext = createContext([]);

const ACTIONS = {
  ADD_WALLET: 'addWallet',
  CHANGE_WALLET: 'changeWallet',
  CHANGE_ENDPOINT: 'changeEndpoint',
  SET_LOGGEDIN: 'setLoggedIn',
  INITIATE_DONE: 'initiateDone',
  LOGOUT: 'logout',
};

const initialState = {
  selectedEndpoint: ENDPOINTS.MAIN,
  isLogged: false,
  ready: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE_ENDPOINT:
      return { ...state, selectedEndpoint: action.value };
    case ACTIONS.SET_LOGGEDIN:
      return { ...state, isLogged: action.value };
    case ACTIONS.INITIATE_DONE:
      return { ...state, ...action.value, ready: true };
    case ACTIONS.LOGOUT:
      return { ...initialState, ready: true };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [walletState, walletActions] = useWallets();
  const [appState, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (walletState.ready && !appState.ready) {
      splash.hide();
      dispatch({
        type: ACTIONS.INITIATE_DONE,
        value: { isLogged: !isNil(walletState.active) },
      });
    }
  }, [walletState.ready, walletState.active, appState.ready]);
  const logout = async () => {
    await walletActions.removeAllWallets();
    dispatch({
      type: ACTIONS.LOGOUT,
    });
  };

  const appActions = {
    ...walletActions,
    logout,
  };

  return (
    <AppContext.Provider value={[{ ...appState, ...walletState }, appActions]}>
      {appState.ready && !walletState.locked && (
        <InactivityCheck
          onIdle={walletActions.lockWallets}
          active={walletState.requiredLock}>
          <RoutesProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </RoutesProvider>
        </InactivityCheck>
      )}
      {walletState.locked && (
        <ThemeProvider>
          <LockedPage />
        </ThemeProvider>
      )}
    </AppContext.Provider>
  );
};

export default AppProvider;
