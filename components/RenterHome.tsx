import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type Car = Database['public']['Tables']['cars']['Row'] & {
  car_images: { image_url: string }[];
};

export default function RenterHome() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const { data, error } = await (supabase
      .from('cars') as any)
      .select('*, car_images(image_url)')
      .eq('status', 'available');
    
    if (data) setCars(data as any);
  };

  const filteredCars = cars.filter(car => 
    car.brand.toLowerCase().includes(search.toLowerCase()) || 
    car.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <VStack space="md" className="p-4 flex-1">
      <VStack space="xs" className="mt-4">
        <Heading size="xl">Find your ride</Heading>
        <Text size="sm" className="text-typography-500">Choose from the best cars in Myanmar</Text>
      </VStack>

      <Input variant="rounded" size="md">
        <InputIcon className="ml-3">
          <Icon as={Search} />
        </InputIcon>
        <InputField 
          placeholder="Search by brand or model..." 
          value={search}
          onChangeText={setSearch}
        />
      </Input>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space="lg" className="pb-20">
          {filteredCars.map((car) => (
            <Pressable 
              key={car.id} 
              onPress={() => router.push(`/car/${car.id}`)}
            >
              <Card className="p-0 rounded-xl overflow-hidden bg-white dark:bg-background-900 shadow-soft-2" variant="elevated">
                <Image
                  source={{ uri: car.car_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800' }}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-[180px] object-cover"
                />
                <VStack className="p-4" space="xs">
                  <HStack className="justify-between items-center">
                    <Heading size="md">{car.brand} {car.model}</Heading>
                    <Text className="font-bold text-primary-600">${car.price_per_day}/day</Text>
                  </HStack>
                  <Text size="sm" className="text-typography-500">{car.location}</Text>
                </VStack>
              </Card>
            </Pressable>
          ))}
          {filteredCars.length === 0 && (
            <Center className="mt-10">
              <Text className="text-typography-400">No cars found matching your search.</Text>
            </Center>
          )}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
