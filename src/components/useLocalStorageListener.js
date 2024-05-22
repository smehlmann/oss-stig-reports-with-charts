import { useEffect, useState } from 'react';

const useLocalStorageListener = (callback) => {
    
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.type) {
        callback(event);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [callback]);
};

export default useLocalStorageListener;
