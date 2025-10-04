import { useEffect, useRef, useState } from 'react';

export function useDebounceValues<T>(value: T, delay: number = 500): T {
  const [debounced, setDebounced] = useState(value);
  const lastSerializedRef = useRef<string>(JSON.stringify(value));

  useEffect(() => {
    const serialized = JSON.stringify(value);

    if (serialized === lastSerializedRef.current) {
      return;
    }

    const handler = setTimeout(() => {
      lastSerializedRef.current = serialized;
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
