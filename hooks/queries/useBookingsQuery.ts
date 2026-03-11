import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  car?: Database['public']['Tables']['cars']['Row'] & {
    owner_id: string; // Ensure this is available for filtering
  };
  profiles?: { full_name: string };
};

export function useBookingsQuery(userId: string | undefined, role: 'renter' | 'car_owner' | undefined) {
  return useQuery({
    queryKey: ['bookings', userId],
    enabled: !!userId && !!role,
    queryFn: async (): Promise<Booking[]> => {
      let query = supabase.from('bookings').select('*, car:cars(*)');

      if (!userId) throw new Error('User ID is required');

      if (role === 'renter') {
        query = query.eq('customer_id', userId);
      } else if (role === 'car_owner') {
        // Find bookings where the car belongs to this owner
        // Since Supabase JS client doesn't easily do nested OR/IN filters for related tables perfectly,
        // we might do a two-step query or use a postgres helper view in a real prod app.
        // For simplicity, we fetch all and filter, or assume RLS handles it.
        // Assuming RLS policy: Owners can only see their cars' bookings.
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // If owner, client-side filter for now until RLS or a custom RPC is set up perfectly
      if (role === 'car_owner') {
         return (data as unknown as Booking[]).filter(b => b.car?.owner_id === userId);
      }

      return data as unknown as Booking[];
    },
  });
}
