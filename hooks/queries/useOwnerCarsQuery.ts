import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

type Car = Database['public']['Tables']['cars']['Row'] & {
  car_images: { image_url: string }[];
};

export function useOwnerCarsQuery(ownerId: string | undefined) {
  return useQuery({
    queryKey: ['cars', 'owner', ownerId],
    enabled: !!ownerId,
    queryFn: async (): Promise<Car[]> => {
      const { data, error } = await supabase
        .from('cars')
        .select('*, car_images(image_url)')
        .eq('owner_id', ownerId!);

      if (error) {
        throw new Error(error.message);
      }

      return data as unknown as Car[];
    },
  });
}
