import React from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useBookingsQuery } from '@/hooks/queries/useBookingsQuery';
import { useQueryClient } from '@tanstack/react-query';

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
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';

export default function OwnerBookings() {
  const { profile } = useAuthStore();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  const { data: bookings = [], isLoading, isError } = useBookingsQuery(profile?.id, 'car_owner');

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await (supabase
      .from('bookings') as any)
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Update Failed</ToastTitle>
                <ToastDescription>{error.message}</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
    } else {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="success" variant="solid">
              <VStack space="xs">
                <ToastTitle>Success</ToastTitle>
                <ToastDescription>Booking {status} successfully.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

  if (isLoading) {
    return (
      <Center className="flex-1">
        <Spinner size="large" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center className="flex-1">
        <Text className="text-error-500">Failed to load bookings.</Text>
      </Center>
    );
  }

  return (
    <Box className="flex-1">
      <VStack space="md" className="pb-20">
        <Heading size="xl" className="mt-4">Booking Requests</Heading>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="lg">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-4 bg-white dark:bg-background-900 shadow-soft-2" variant="elevated">
                <VStack space="sm">
                  <HStack className="justify-between items-center">
                    <VStack>
                      <Heading size="sm">{booking.car?.brand} {booking.car?.model}</Heading>
                      <Text size="xs" className="text-typography-500">Customer: {booking.profiles?.full_name || 'Unknown'}</Text>
                    </VStack>
                    <Badge action={booking.status === 'pending' ? 'warning' : booking.status === 'approved' ? 'success' : 'error'}>
                      <BadgeText>{booking.status.toUpperCase()}</BadgeText>
                    </Badge>
                  </HStack>
                  
                  <Divider />
                  
                  <HStack className="justify-between">
                    <Text size="xs" className="text-typography-500">Dates</Text>
                    <Text size="xs">{booking.start_date} to {booking.end_date}</Text>
                  </HStack>

                  {booking.status === 'pending' && (
                    <HStack space="md" className="mt-2">
                      <Button className="flex-1" action="primary" onPress={() => handleUpdateStatus(booking.id, 'approved')}>
                        <ButtonText>Approve</ButtonText>
                      </Button>
                      <Button className="flex-1" variant="outline" action="negative" onPress={() => handleUpdateStatus(booking.id, 'rejected')}>
                        <ButtonText>Reject</ButtonText>
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Card>
            ))}
            {bookings.length === 0 && (
              <Center className="mt-10">
                <Text className="text-typography-500">No booking requests found.</Text>
              </Center>
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}
