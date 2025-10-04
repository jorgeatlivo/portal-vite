import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import { usePostHog } from 'posthog-js/react';

import QueryProvider from '@/providers/query-provider';
import { configureUnauthorizedApi } from '@/services/api';
import { setAccountInfo } from '@/store/actions/accountActions';

import { AuthProvider, useAuth } from '@/contexts/Authentication.context';
import { GlobalModalProvider } from '@/contexts/GlobalModalContext';
import { RouterComponent } from '@/routers/Router';
import ThemeProvider from '@/theme/provider';
import { AccountChangeInterceptorProvider } from './components/layout/components/AccountChangeInterceptor';

import './App.css';
import '@fontsource/roboto/300.css'; // Light
import '@fontsource/roboto/400.css'; // Regular
import '@fontsource/roboto/500.css'; // Medium
import '@fontsource/roboto/600.css'; // Medium
import '@fontsource/roboto/700.css'; // Bold
import '@fontsource/roboto/400-italic.css'; // Italic

function App() {
  const dispatch = useDispatch();
  const posthog = usePostHog();

  const { logOut } = useAuth();

  const signOut = () => {
    logOut();
    dispatch(setAccountInfo(null));
    posthog.reset();
  };

  useLayoutEffect(() => {
    return configureUnauthorizedApi(() => {
      signOut();
    });
  }, []);

  return (
    <div className="relative h-screen min-h-screen flex-col overflow-y-auto  overscroll-contain xxs:overflow-auto md:overflow-y-hidden">
      <RouterComponent logOut={signOut} />
    </div>
  );
}

/**
 * @description
 * ```
 * Implementations of Provider pattern,
 * Where the AppProvider component wraps the entire application with the necessary providers.
 * This pattern is useful for providing global state to the entire application.
 * Rules: Functions providers first -> Context providers -> Component providers
 * ```
 */
const AppProvider = () => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <AccountChangeInterceptorProvider>
            <GlobalModalProvider>
              <App />
            </GlobalModalProvider>
          </AccountChangeInterceptorProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
