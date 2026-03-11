import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * A hook that triggers a function whenever the screen comes into focus.
 * Useful for refetching React Query data when returning to a tab.
 */
export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );
}
