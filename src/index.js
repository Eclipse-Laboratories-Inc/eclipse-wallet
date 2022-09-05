import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { isExtension } from './utils/platform';
isExtension() ? import('./index-extension.css') : import('./index-web.css');
import App from './App';
import reportWebVitals from './reportWebVitals';
import './globals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
