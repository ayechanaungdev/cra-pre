import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useCarsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Create a subscription channel to the 'cars' table
    const channel = supabase
      .channel('public:cars')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, and DELETE
          schema: 'public',
          table: 'cars',
        },
        (payload) => {
          console.log('Realtime change detected on Cars:', payload);
          // 2. When a change happens, tell TanStack Query the 'cars' data is stale
          // This will trigger an automatic background refetch for any component using useCarsQuery
          queryClient.invalidateQueries({ queryKey: ['cars'] });
          // Invalidate the owner stats query so the "Active Cars" count updates
          queryClient.invalidateQueries({ queryKey: ['ownerStats'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime cars updates');
        }
      });

    // 3. Cleanup the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
