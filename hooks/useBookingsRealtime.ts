import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useBookingsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen to changes on the bookings table
    const channel = supabase
      .channel('public:bookings')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('Realtime change detected on Bookings:', payload);
          // Invalidate the bookings list query
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          // Invalidate the owner stats query so the dashboard numbers update
          queryClient.invalidateQueries({ queryKey: ['ownerStats'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime bookings updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
