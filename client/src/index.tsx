import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function getLibrary(provider: any) {
  return new Web3Provider(provider);
}

root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
    </Web3ReactProvider>
  </React.StrictMode>
);

