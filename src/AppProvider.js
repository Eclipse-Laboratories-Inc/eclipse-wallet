import React, {createContext, useEffect, useState} from 'react';
import ThemProvider from './component-library/Theme/ThemeProvider';
import * as splash from './utils/splash';

export const AppContext = createContext({});

const AppProvider = ({children}) => {
  const appState = useState({});
  const appActions = useState({});
  useEffect(() => {
    splash.hide();
  }, []);
  return (
    <AppContext.Provider value={[appState, appActions]}>
      <ThemProvider>{children}</ThemProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;
