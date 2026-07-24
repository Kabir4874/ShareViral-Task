import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

import { useTaskStore } from '@/store/useTaskStore';

export function useNetworkStatus(): {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
} {
  const setIsOffline = useTaskStore((state) => state.setIsOffline);
  const [status, setStatus] = useState<{
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
  }>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
      setStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [setIsOffline]);

  return status;
}
