import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Database } from '../../types/database.types';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Plus } from 'lucide-react-native';

type Driver = Database['public']['Tables']['drivers']['Row'];

export default function DriversScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchDrivers();
    }
  }, [profile]);

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      // @ts-ignore
      .eq('owner_id', profile!.id);
    
    if (data) setDrivers(data);
    setIsLoading(false);
  };

  return (
    <Box className="flex-1 bg-white dark:bg-black">
      <VStack space="md" className="p-4 flex-1">
        <Heading size="xl" className="mt-4">My Drivers</Heading>
        
        {isLoading ? (
          <Center className="flex-1"><Spinner /></Center>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack space="md" className="pb-20">
              {drivers.map((driver) => (
                <Card key={driver.id} className="p-4 bg-white dark:bg-background-900 shadow-soft-1" variant="elevated">
                  <HStack space="md" className="items-center">
                    <Avatar size="md">
                      <AvatarFallbackText>{driver.name}</AvatarFallbackText>
                      {driver.photo_url && <AvatarImage source={{ uri: driver.photo_url }} alt={`${driver.name}'s photo`} />}
                    </Avatar>
                    <VStack className="flex-1">
                      <Heading size="sm">{driver.name}</Heading>
                      <Text size="xs" className="text-typography-500">{driver.phone}</Text>
                    </VStack>
                    <Badge action={driver.status === 'available' ? 'success' : 'warning'}>
                      <BadgeText>{driver.status.toUpperCase()}</BadgeText>
                    </Badge>
                  </HStack>
                </Card>
              ))}
              {drivers.length === 0 && (
                <Center className="mt-10">
                  <Text className="text-typography-500">No drivers added yet.</Text>
                </Center>
              )}
            </VStack>
          </ScrollView>
        )}
      </VStack>

      <Fab 
        size="md" 
        placement="bottom right" 
        onPress={() => router.push('/owner/add_driver')}
        className="bottom-[90px] right-[20px]"
      >
        <FabIcon as={Plus} className="mr-2" />
        <FabLabel>Add Driver</FabLabel>
      </Fab>
    </Box>
  );
}
