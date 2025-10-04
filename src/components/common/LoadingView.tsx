import React from 'react';

import { CircularProgress } from '@mui/material';

const LoadingView = () => {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <CircularProgress />
    </div>
  );
};

export default LoadingView;
