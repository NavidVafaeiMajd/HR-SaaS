import { useLoading } from '@/Context/LoadingContext';
import { useEffect } from 'react';

export const useLoadingState = (isLoading: boolean, message?: string) => {
  const { setIsLoading, setLoadingMessage } = useLoading();

  useEffect(() => {
    setIsLoading(isLoading);
    if (message) {
      setLoadingMessage(message);
    }
  }, [isLoading, message, setIsLoading, setLoadingMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);
};
