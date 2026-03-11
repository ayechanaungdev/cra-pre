import { useRouter } from 'expo-router';
import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOwnerCarsQuery } from '@/hooks/queries/useOwnerCarsQuery';
import { useCarsRealtime } from '@/hooks/useCarsRealtime';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';
import { Plus } from 'lucide-react-native';

export default function OwnerCarsScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  
  const { data: cars = [], isLoading, isError } = useOwnerCarsQuery(profile?.id);

  // Subscribe to real-time changes
  useCarsRealtime();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'pending': return 'warning';
      case 'booked': return 'info';
      case 'rejected': return 'error';
      default: return 'muted';
    }
  };

  if (isLoading) {
    return (
      <Box className="flex-1 bg-white dark:bg-black p-4">
        <HStack className="justify-between items-center mt-4">
          <Heading size="xl">My Fleet</Heading>
        </HStack>
        <Center className="flex-1">
          <Spinner size="large" />
        </Center>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="flex-1 bg-white dark:bg-black p-4">
        <HStack className="justify-between items-center mt-4">
          <Heading size="xl">My Fleet</Heading>
        </HStack>
        <Center className="flex-1">
          <Text className="text-error-500">Failed to load cars.</Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-white dark:bg-black">
      <VStack space="md" className="p-4 flex-1">
        <HStack className="justify-between items-center mt-4">
          <Heading size="xl">My Fleet</Heading>
        </HStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="md" className="pb-20">
            {cars.map((car) => (
              <Card key={car.id} className="p-0 rounded-xl overflow-hidden bg-white dark:bg-background-900 shadow-hard-1" variant="elevated">
                <HStack>
                  <Image
                    source={{ uri: car.car_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800' }}
                    alt={`${car.brand} ${car.model}`}
                    className="w-[120px] h-[100px]"
                  />
                  <VStack className="p-3 flex-1 justify-between">
                    <VStack>
                      <Heading size="xs">{car.brand} {car.model}</Heading>
                      <Text size="xs" className="text-typography-500">{car.location}</Text>
                    </VStack>
                    <HStack className="justify-between items-center">
                      <Badge action={getStatusColor(car.status) as any}>
                        <BadgeText>{car.status.toUpperCase()}</BadgeText>
                      </Badge>
                      <Text className="font-bold text-sm">${car.price_per_day}/day</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
            ))}
            {cars.length === 0 && (
              <Center className="mt-10">
                <Text className="text-typography-500">You haven't listed any cars yet.</Text>
              </Center>
            )}
          </VStack>
        </ScrollView>
      </VStack>

      <Fab 
        size="md" 
        placement="bottom right" 
        onPress={() => router.push('/owner/add_car')}
        className="bottom-[90px] right-[20px]"
      >
        <FabIcon as={Plus} className="mr-2" />
        <FabLabel>Add Car</FabLabel>
      </Fab>
    </Box>
  );
}
