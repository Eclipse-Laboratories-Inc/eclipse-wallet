import React, { createContext, useEffect, useReducer } from 'react';
import isNil from 'lodash/isNil';
import ThemeProvider from './component-library/Theme/ThemeProvider';
import RoutesProvider from './routes/RoutesProvider';
import * as splash from './utils/splash';
import useWallets from './hooks/useWallets';
import LockedPage from './pages/Lock/LockedPage';
import InactivityCheck from './features/InactivityCheck/InactivityCheck';
import GlobalSkeleton from './component-library/Global/GlobalSkeleton';
import GlobalError from './features/ErrorHandler/GlobalError';
import useTranslations from './hooks/useTranslations';
import useAddressbook from './hooks/useAddressbook';
import useRuntime from './hooks/useRuntime';

export const AppContext = createContext([]);

const ACTIONS = {
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
  const [
    { ready: walletReady, active: walletActive, ...walletState },
    walletActions,
  ] = useWallets();
  const [{ ready: addressReady, ...addressBookState }, addressBookActions] =
    useAddressbook();
  const {
    selected: selectedLanguage,
    loaded: translationsLoaded,
    languages,
    changeLanguage,
  } = useTranslations();
  const { ready: runtimeReady, ...runtimeState } = useRuntime();
  const [appState, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (
      walletReady &&
      !appState.ready &&
      translationsLoaded &&
      addressReady &&
      runtimeReady
    ) {
      splash.hide();
      dispatch({
        type: ACTIONS.INITIATE_DONE,
        value: { isLogged: !isNil(walletActive) },
      });
    }
  }, [
    walletReady,
    walletActive,
    appState.ready,
    translationsLoaded,
    addressReady,
    runtimeReady,
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
    ...addressBookActions,
    changeLanguage,
    logout,
    toggleHideBalance,
  };
  const onAppIdle = () => {
    if (walletState.requiredLock) {
      walletActions.lockWallets();
    }
  };

  return (
    <AppContext.Provider
      value={[
        {
          ...appState,
          ...walletState,
          ...addressBookState,
          ...runtimeState,
          languages,
          selectedLanguage,
        },
        appActions,
      ]}>
      <GlobalError>
        {!appState.ready && !walletState.locked && (
          <ThemeProvider>
            <GlobalSkeleton type="Generic" />
          </ThemeProvider>
        )}
        {appState.ready && !walletState.locked && (
          <RoutesProvider>
            <ThemeProvider>
              <InactivityCheck onIdle={onAppIdle} active>
                {children}
              </InactivityCheck>
            </ThemeProvider>
          </RoutesProvider>
        )}
        {walletState.locked && (
          <RoutesProvider>
            <ThemeProvider>
              <LockedPage />
            </ThemeProvider>
          </RoutesProvider>
        )}
      </GlobalError>
    </AppContext.Provider>
  );
};

export default AppProvider;
