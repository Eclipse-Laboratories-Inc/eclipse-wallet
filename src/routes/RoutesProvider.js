import React from 'react';
import {BrowserRouter} from 'react-router-dom';

const RoutesProvider = ({children}) => (
  <BrowserRouter>{children}</BrowserRouter>
);

export default RoutesProvider;
