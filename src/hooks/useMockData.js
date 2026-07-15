import { useState, useEffect } from 'react';
import { getSnapshot, subscribe } from '../mock/generator';

/**
 * useMockData — React hook that subscribes to the live mock data generator.
 * Returns a snapshot that auto-updates every 8 seconds.
 */
export function useMockData() {
  const [data, setData] = useState(() => getSnapshot());

  useEffect(() => {
    const unsubscribe = subscribe(setData);
    return unsubscribe;
  }, []);

  return data;
}
