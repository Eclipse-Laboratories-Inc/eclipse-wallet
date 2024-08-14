import React, { createContext, useEffect, useReducer } from 'react';
import { isNil } from 'lodash';
import ThemeProvider from './component-library/Theme/ThemeProvider';
import RoutesProvider from './routes/RoutesProvider';
import * as splash from './utils/splash';
import LockedPage from './pages/Lock/LockedPage';
import InactivityCheck from './features/InactivityCheck/InactivityCheck';
import GlobalSkeleton from './component-library/Global/GlobalSkeleton';
import GlobalError from './features/ErrorHandler/GlobalError';
import useTranslations from './hooks/useTranslations';
import useAddressbook from './hooks/useAddressbook';
import useRuntime from './hooks/useRuntime';
import useAccounts from './hooks/useAccounts';

export const AppContext = createContext([]);

const ACTIONS = {
  SET_LOGGEDIN: 'SET_LOGGEDIN',
  INITIALIZATION_COMPLETE: 'INITIALIZATION_COMPLETE',
  HIDE_BALANCE: 'HIDE_BALANCE',
  SHOW_BALANCE: 'SHOW_BALANCE',
  LOGOUT: 'LOGOUT',
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
    case ACTIONS.INITIALIZATION_COMPLETE:
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
  const [{ ready: accountsReady, ...accountsState }, accountsActions] = useAccounts();
  const [{ ready: addressReady, ...addressBookState }, addressBookActions] = useAddressbook();
  const { selected: selectedLanguage, loaded: translationsLoaded, languages, changeLanguage } = useTranslations();
  const { ready: runtimeReady, ...runtimeState } = useRuntime();
  const [appState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (accountsReady && !appState.ready && translationsLoaded && addressReady && runtimeReady) {
      splash.hide();
      dispatch({
        type: ACTIONS.INITIALIZATION_COMPLETE,
        value: { isLogged: !isNil(accountsState.activeAccount) },
      });
    }
  }, [accountsReady, accountsState.activeAccount, appState.ready, translationsLoaded, addressReady, runtimeReady]);

  const logout = async () => {
    await accountsActions.removeAllAccounts();
    dispatch({ type: ACTIONS.LOGOUT });
  };

  const toggleHideBalance = () => {
    dispatch({
      type: appState.hiddenBalance ? ACTIONS.SHOW_BALANCE : ACTIONS.HIDE_BALANCE,
    });
  };

  const appActions = {
    ...accountsActions,
    ...addressBookActions,
    changeLanguage,
    logout,
    toggleHideBalance,
  };

  const onAppIdle = () => {
    if (accountsState.requiredLock) {
      accountsActions.lockAccounts();
    }
  };

  return (
    <AppContext.Provider
      value={[
        {
          ...appState,
          ...accountsState,
          ...addressBookState,
          ...runtimeState,
          languages,
          selectedLanguage,
        },
        appActions,
      ]}
    >
      <GlobalError>
        {!appState.ready && !accountsState.locked ? (
          <ThemeProvider>
            <GlobalSkeleton type="Generic" />
          </ThemeProvider>
        ) : (
          <>
            {appState.ready && !accountsState.locked && (
              <RoutesProvider>
                <ThemeProvider>
                  <InactivityCheck onIdle={onAppIdle} active>
                    {children}
                  </InactivityCheck>
                </ThemeProvider>
              </RoutesProvider>
            )}
            {accountsState.locked && (
              <ThemeProvider>
                <LockedPage />
              </ThemeProvider>
            )}
          </>
        )}
      </GlobalError>
    </AppContext.Provider>
  );
};

export default AppProvider;
