import { useRouter } from 'expo-router';
import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useBookingsQuery } from '@/hooks/queries/useBookingsQuery';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';

export default function RenterBookings() {
  const router = useRouter();
  const { session } = useAuthStore();
  
  const { data: bookings = [], isLoading, isError } = useBookingsQuery(session?.user.id, 'renter');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'rejected': return 'error';
      default: return 'muted';
    }
  };

  return (
    <Box className="flex-1">
      <VStack space="md" className="pb-20">
        <Heading size="xl" className="mt-4">My Bookings</Heading>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="md">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-4 bg-white dark:bg-background-900 shadow-soft-1" variant="elevated">
                <VStack space="sm">
                  <HStack className="justify-between items-center">
                    <Heading size="sm">{booking.car?.brand} {booking.car?.model}</Heading>
                    <Badge action={getStatusColor(booking.status) as any}>
                      <BadgeText>{booking.status.toUpperCase()}</BadgeText>
                    </Badge>
                  </HStack>
                  
                  <Divider />
                  
                  <HStack className="justify-between">
                    <Text size="xs" className="text-typography-500">Duration</Text>
                    <Text size="xs">{booking.start_date} to {booking.end_date}</Text>
                  </HStack>
                  
                  <HStack className="justify-between">
                    <Text size="xs" className="text-typography-500">Total Price</Text>
                    <Text size="sm" className="font-bold">${booking.total_price}</Text>
                  </HStack>

                  <Button 
                    variant="link" 
                    size="sm" 
                    onPress={() => router.push(`/messages/${booking.car?.owner_id}`)}
                    className="self-start p-0 mt-2"
                  >
                    <ButtonText className="text-primary-600">Contact Owner</ButtonText>
                  </Button>
                </VStack>
              </Card>
            ))}
            {bookings.length === 0 && (
              <Center className="mt-10">
                <Text className="text-typography-500">You haven't made any bookings yet.</Text>
              </Center>
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}
