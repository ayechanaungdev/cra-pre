import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Database } from '../types/database.types';

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

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  cars: { brand: string, model: string, owner_id: string };
};

export default function RenterBookings() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetchBookings();

      // Subscribe to real-time changes on the bookings table for this user
      const channel = supabase
        .channel(`renter_bookings_${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE', // Mainly care about status updates from owner
            schema: 'public',
            table: 'bookings',
            filter: `customer_id=eq.${session.user.id}`,
          },
          (payload) => {
            console.log('Booking status change received:', payload);
            fetchBookings();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const fetchBookings = async () => {
    const { data, error } = await (supabase
      .from('bookings') as any)
      .select('*, cars(brand, model, owner_id)')
      .eq('customer_id', session!.user.id)
      .order('created_at', { ascending: false });

    if (data) setBookings(data as any);
  };

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
                    <Heading size="sm">{booking.cars.brand} {booking.cars.model}</Heading>
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
                    onPress={() => router.push(`/messages/${booking.cars.owner_id}`)}
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
