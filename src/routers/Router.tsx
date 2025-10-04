import React, { Suspense } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useParams,
} from 'react-router-dom';

import { CircularProgress } from '@mui/material';

import { ACCOUNT_TYPE } from '@/services/account';

import GlobalModalContainer from '@/components/common/modal/GlobalModalContainer';

import NotFound from '@/pages/404';
import Landing from '@/pages/Landing';
import EmailGateKeeper from '@/pages/RegisterFlow/views/EmailGateKeeper';
import RegisterFlow from '@/pages/RegisterFlow/views/RegisterFlow';
import ResetPasswordFlow from '@/pages/ResetPasswordFlow/ResetPasswordFlow';
import SignInForm from '@/pages/SignInForm';
import { oldRouteRedirects, protectedRoutes } from '@/routers/config';
import ProtectedLayout from '@/routers/layout/ProtectedLayout';
import OfflineRoute from '@/routers/OfflineRoute';
import ProtectedRoute from '@/routers/ProtectedRoute';
import PublicRoute from '@/routers/PublicRoute';

interface RouterComponentProps {
  logOut: () => void;
}

function RedirectWithId({ to }: { to: (id: string) => string }) {
  const { id } = useParams();
  return <Navigate to={to(id!)} replace />;
}

export const RouterComponent: React.FC<RouterComponentProps> = ({ logOut }) => {
  // const filteredRoutes = useProtectedRoutes();
  const wasLoggedInBefore = localStorage.getItem('last_login') !== null;

  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Landing />}>
            <Route
              index
              element={wasLoggedInBefore ? <SignInForm /> : <EmailGateKeeper />}
            />
            <Route path="signin" element={<SignInForm />} />
            <Route path="register" element={<EmailGateKeeper />} />
          </Route>
          {Object.values(ACCOUNT_TYPE).map((accountType) => (
            <Route key={`router-${accountType}`} path={accountType}>
              <Route
                path="reset-password"
                element={<ResetPasswordFlow accountType={accountType} />}
              />
            </Route>
          ))}
          <Route path="register/new-account" element={<RegisterFlow />} />
        </Route>

        {oldRouteRedirects.map((conf) => (
          <Route
            key={conf.old}
            path={conf.old}
            element={
              typeof conf.new === 'function' ? (
                <RedirectWithId to={conf.new} />
              ) : (
                <Navigate to={conf.new} replace />
              )
            }
          />
        ))}

        <Route element={<OfflineRoute />}>
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout logOut={logOut} />}>
              {protectedRoutes.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={
                    <Suspense
                      key={route.id}
                      fallback={
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <CircularProgress />
                        </div>
                      }
                    >
                      <route.component />
                    </Suspense>
                  }
                />
              ))}
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <GlobalModalContainer />
    </Router>
  );
};
