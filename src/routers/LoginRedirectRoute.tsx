import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  navigateTo: string | null;
}

const PublicRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  navigateTo,
}) => {
  return isAuthenticated && typeof navigateTo === 'string' ? (
    <Navigate to={navigateTo || '#'} replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
