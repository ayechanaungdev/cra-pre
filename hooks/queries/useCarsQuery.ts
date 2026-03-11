import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

type Car = Database['public']['Tables']['cars']['Row'] & {
  car_images: { image_url: string }[];
};

export function useCarsQuery() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: async (): Promise<Car[]> => {
      const { data, error } = await supabase
        .from('cars')
        .select('*, car_images(image_url)')
        .eq('status', 'available');

      if (error) {
        throw new Error(error.message);
      }

      return data as unknown as Car[];
    },
  });
}
