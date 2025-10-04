import { useCallback, useMemo } from 'react';
import {
  useLocation,
  useSearchParams as useSearchParamsRouter,
} from 'react-router-dom';

export type ParamValue = string | number | boolean | null | undefined;
export function useSearchParams<T extends Record<string, string>>() {
  const { search } = useLocation();
  const [, setParams] = useSearchParamsRouter();

  const params = useMemo(() => {
    const params = new URLSearchParams(search);
    const result: Partial<T> = {};

    params.forEach((value, key) => {
      result[key as keyof T] = value as T[keyof T]; // Ép kiểu với generic
    });

    return result;
  }, [search]);

  const setParam = useCallback(
    (name: string, value: ParamValue) => {
      const newParams = new URLSearchParams(search);
      if (value === undefined || value === null) {
        newParams.delete(name);
      } else {
        newParams.set(name, String(value));
      }
      setParams(newParams);
    },
    [search, setParams]
  );

  const setMultiParams = (params: Record<string, ParamValue>) => {
    const newParams = new URLSearchParams(search);
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    setParams(newParams);
  };

  return { params, setParam, setMultiParams };
}

export function useSearchParam(param: string) {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get(param) ?? '';
  }, [param, search]);
}

export function getSearchParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams('');
  return new URLSearchParams(window.location.search);
}

export function getSearchParam(name: string): string {
  return getSearchParams().get(name) ?? '';
}
