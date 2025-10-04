import { useCallback, useEffect, useState } from 'react';

export const usePersistBooleanInLocalStorage = (
  key: string,
  defaultValue = false
) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {}
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, String(storedValue));
    } catch {}
  }, [key, storedValue]);

  const toggle = useCallback(() => {
    setStoredValue((prev) => !prev);
  }, []);

  return { storedValue, setStoredValue, toggle };
};
