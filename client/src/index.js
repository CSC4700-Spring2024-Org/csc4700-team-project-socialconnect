import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import initFacebookSDK from './initFacebookSDK';

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {root.render(
  <Provider store={store}>
    <App />
  </Provider>
)};

initFacebookSDK().then(() => {
  renderApp()
})