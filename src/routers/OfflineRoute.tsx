import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { RootState } from '@/store/types';

import NoInternetPage from '@/pages/NoInternetPage';

const OfflineRoute: React.FC = () => {
  const { internetConnection } = useSelector(
    (state: RootState) => state.appConfiguration
  );

  if (!internetConnection) {
    return <NoInternetPage />;
  }

  return <Outlet />;
};

export default OfflineRoute;
