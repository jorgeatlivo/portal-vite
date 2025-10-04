import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { PostHogConfig } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import ReactDOM from 'react-dom/client';

import i18n from '@/services/i18next';

import store from '@/store';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const options: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  debug: import.meta.env.NODE_ENV === 'development',
};

root.render(
  <PostHogProvider
    apiKey={
      import.meta.env.NODE_ENV === 'development'
        ? ''
        : (import.meta.env.VITE_PUBLIC_POSTHOG_KEY ?? '')
    }
    options={options}
  >
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
  </PostHogProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
