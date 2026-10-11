'use client';

import { useEffect, useState } from 'react';
import { fetchWaimf } from '@/utils/waimf';

// Every inner page needs the same record and the same loading flag.
export const useWaimf = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaimf()
      .then(setData)
      .catch((error) => console.error('Error loading WAIMF:', error))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};

export default useWaimf;
