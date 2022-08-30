import React from 'react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { isExtension } from '../utils/platform';

const RoutesProvider = ({ children }) =>
  isExtension() ? (
    <MemoryRouter>{children}</MemoryRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );

export default RoutesProvider;
