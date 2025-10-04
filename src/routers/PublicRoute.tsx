import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/contexts/Authentication.context';
import { protectedRoutes } from '@/routers/config';

const PublicRoute: React.FC = () => {
  const { token } = useAuth();
  const dashboardLink = protectedRoutes[0]?.path;
  const isAuthenticated = !!token;

  return isAuthenticated && typeof dashboardLink === 'string' ? (
    <Navigate to={dashboardLink || '#'} replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
