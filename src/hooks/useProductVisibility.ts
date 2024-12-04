import { useState, useCallback, useEffect } from 'react';

export function useProductVisibility() {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      const saved = localStorage.getItem('productListVisible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleVisibility = useCallback((value: boolean) => {
    setIsVisible(value);
    try {
      localStorage.setItem('productListVisible', JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save visibility state:', error);
    }
  }, []);

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      try {
        localStorage.removeItem('productListVisible');
      } catch (error) {
        console.error('Failed to clear visibility state:', error);
      }
    };
  }, []);

  return {
    isVisible,
    toggleVisibility
  };
}