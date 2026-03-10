import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, ShieldCheck, Star, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type Car = Database['public']['Tables']['cars']['Row'] & {
  car_images: { image_url: string }[];
  profiles: { full_name: string, avatar_url: string | null };
};

export default function CarDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCarDetail();
    }
  }, [id]);

  const fetchCarDetail = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('*, car_images(image_url), profiles:owner_id(full_name, avatar_url)')
      .eq('id', id as string)
      .single();
    
    if (data) setCar(data as any);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Center className="flex-1">
        <Spinner size="large" />
      </Center>
    );
  }

  if (!car) {
    return (
      <Center className="flex-1">
        <Text>Car not found.</Text>
        <Button onPress={() => router.back()} className="mt-4">
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Center>
    );
  }

  return (
    <Box className="flex-1 bg-white dark:bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box className="relative">
          <Image
            source={{ uri: car.car_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800' }}
            alt="Car image"
            className="w-full h-[300px]"
          />
          <Pressable 
            onPress={() => router.back()}
            className="absolute top-[50px] left-5 p-2 bg-white/80 rounded-full"
          >
            <Icon as={ChevronLeft} className="text-black" />
          </Pressable>
        </Box>

        <VStack className="p-6" space="lg">
          <VStack space="xs">
            <HStack className="justify-between items-center">
              <Heading size="2xl">{car.brand} {car.model}</Heading>
              <HStack space="xs" className="items-center">
                <Icon as={Star} className="w-4 h-4 text-warning-600" />
                <Text className="font-bold">4.8</Text>
              </HStack>
            </HStack>
            <HStack space="xs" className="items-center">
              <Icon as={MapPin} className="w-3 h-3 text-typography-500" />
              <Text size="sm" className="text-typography-500">{car.location}</Text>
            </HStack>
          </VStack>

          <HStack space="md">
            <FeatureCard icon={Zap} title="Instant" desc="Fast Booking" />
            <FeatureCard icon={ShieldCheck} title="Verified" desc="Safety Guaranteed" />
          </HStack>

          <VStack space="sm">
            <Heading size="md">Description</Heading>
            <Text size="sm" className="leading-6 text-typography-600">
              {car.description || "This premium vehicle offers a comfortable and smooth ride, perfect for both city driving and long road trips. Well-maintained and fuel-efficient."}
            </Text>
          </VStack>

          <Divider />

          <HStack className="justify-between items-center">
            <VStack>
              <Text size="xs" className="text-typography-500">Price</Text>
              <HStack className="items-baseline">
                <Text size="xl" className="font-bold text-primary-600">${car.price_per_day}</Text>
                <Text size="sm" className="text-typography-500"> / day</Text>
              </HStack>
            </VStack>
            <HStack space="sm">
              <Button size="lg" variant="outline" action="secondary" onPress={() => router.push(`/messages/${car.owner_id}`)}>
                <ButtonText>Chat</ButtonText>
              </Button>
              <Button size="lg" onPress={() => router.push(`/booking/create?carId=${car.id}`)}>
                <ButtonText>Book Now</ButtonText>
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <Card className="p-4 flex-1 bg-background-50 dark:bg-background-900" variant="outline">
      <VStack space="xs" className="items-center">
        <Icon as={icon} className="text-primary-600 w-6 h-6" />
        <Text className="font-bold text-sm">{title}</Text>
        <Text size="xs" className="text-typography-500">{desc}</Text>
      </VStack>
    </Card>
  );
}
