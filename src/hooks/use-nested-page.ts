import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAction } from '@/hooks/use-params-action';

export const useNestedPage = (urlAction: string, relatedParam: string = '') => {
  const { active: isOpenPage } = useAction(urlAction);
  const [isVisible, setIsVisible] = useState(isOpenPage);
  const [searchParams, setSearchParams] = useSearchParams();
  const relatedParamValue = searchParams.get(relatedParam);

  const goBack = () => {
    setIsVisible(false);
    setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      newParams.delete(relatedParam);
      setSearchParams(newParams);
    }, 300);
  };

  useEffect(() => {
    isOpenPage && setIsVisible(true);
  }, [isOpenPage]);

  return { isOpenPage, isVisible, relatedParamValue, goBack };
};
