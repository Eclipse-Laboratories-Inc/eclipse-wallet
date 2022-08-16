import { AppContext } from '../AppProvider';
import React, { useContext } from 'react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';

const RoutesProvider = ({ children }) => {
  const [{ isExtension }] = useContext(AppContext);
  if (isExtension) return <MemoryRouter>{children}</MemoryRouter>;
  else return <BrowserRouter>{children}</BrowserRouter>;
};
export default RoutesProvider;
