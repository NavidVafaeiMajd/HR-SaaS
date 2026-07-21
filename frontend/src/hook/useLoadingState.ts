import { useLoading } from '@/Context/LoadingContext';
import { useEffect } from 'react';

export const useLoadingState = (isLoading: boolean, message?: string) => {
  const { setIsLoadingNavbar, setLoadingMessage } = useLoading();

  useEffect(() => {
    setIsLoadingNavbar(isLoading);
    if (message) {
      setLoadingMessage(message);
    }
  }, [isLoading, message, setIsLoadingNavbar, setLoadingMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsLoadingNavbar(false);
    };
  }, [setIsLoadingNavbar]);
};
