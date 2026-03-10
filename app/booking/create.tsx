import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';

export default function BookingCreateScreen() {
  const router = useRouter();
  const toast = useToast();
  const { session } = useAuthStore();
  const { carId } = useLocalSearchParams<{ carId: string }>();
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickup, setPickup] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onStartChange = (date: string) => {
    // react-native-modern-datepicker returns YYYY/MM/DD
    const formatted = date.replace(/\//g, '-');
    setStartDate(formatted);
    setShowStartPicker(false);
  };

  const onEndChange = (date: string) => {
    const formatted = date.replace(/\//g, '-');
    setEndDate(formatted);
    setShowEndPicker(false);
  };

  const handleBooking = async () => {
    if (!pickup || !session?.user || !carId) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="warning" variant="solid">
              <VStack space="xs">
                <ToastTitle>Missing Fields</ToastTitle>
                <ToastDescription>Please fill in all details.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await (supabase.from('bookings') as any).insert({
      customer_id: session.user.id,
      car_id: carId,
      start_date: startDate,
      end_date: endDate,
      pickup_location: pickup,
      total_price: 150,
      status: 'pending'
    });

    if (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Booking Failed</ToastTitle>
                <ToastDescription>{error.message}</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      setIsLoading(false);
    } else {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="success" variant="solid">
              <VStack space="xs">
                <ToastTitle>Booking Requested!</ToastTitle>
                <ToastDescription>Wait for the owner's approval.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      router.replace('/(tabs)/bookings');
    }
  };

  return (
    <Box className="flex-1 bg-white dark:bg-black p-6">
      <VStack space="xl" className="mt-10">
        <Center>
          <Heading size="xl">Request Booking</Heading>
          <Text size="sm" className="text-typography-500">Fast and secure car sharing</Text>
        </Center>

        <VStack space="md">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Start Date</FormControlLabelText>
            </FormControlLabel>
            <Pressable onPress={() => setShowStartPicker(true)}>
              <Input isReadOnly>
                <InputField 
                  placeholder="Select Start Date" 
                  value={startDate}
                  editable={false}
                />
              </Input>
            </Pressable>
            <Modal visible={showStartPicker} transparent animationType="slide">
              <Box className="flex-1 justify-center bg-black/50 p-4">
                <Box className="bg-white rounded-lg p-4">
                  <DatePicker
                    mode="calendar"
                    selected={startDate.replace(/-/g, '/')}
                    onSelectedChange={onStartChange}
                    minimumDate={new Date().toISOString().split('T')[0].replace(/-/g, '/')}
                    style={{ borderRadius: 10 }}
                  />
                  <Button action="secondary" onPress={() => setShowStartPicker(false)} className="mt-4">
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                </Box>
              </Box>
            </Modal>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>End Date</FormControlLabelText>
            </FormControlLabel>
            <Pressable onPress={() => setShowEndPicker(true)}>
              <Input isReadOnly>
                <InputField 
                  placeholder="Select End Date" 
                  value={endDate}
                  editable={false}
                />
              </Input>
            </Pressable>
            <Modal visible={showEndPicker} transparent animationType="slide">
              <Box className="flex-1 justify-center bg-black/50 p-4">
                <Box className="bg-white rounded-lg p-4">
                  <DatePicker
                    mode="calendar"
                    selected={endDate.replace(/-/g, '/')}
                    onSelectedChange={onEndChange}
                    minimumDate={startDate.replace(/-/g, '/')}
                    style={{ borderRadius: 10 }}
                  />
                  <Button action="secondary" onPress={() => setShowEndPicker(false)} className="mt-4">
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                </Box>
              </Box>
            </Modal>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Pickup Location</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField 
                placeholder="Enter pickup address" 
                value={pickup}
                onChangeText={setPickup}
              />
            </Input>
          </FormControl>

          <Box className="mt-6">
            <Divider className="mb-4" />
            <VStack space="xs">
              <HStack className="justify-between">
                <Text size="sm">Estimate Total</Text>
                <Text className="font-bold text-lg">$150.00</Text>
              </HStack>
              <Text size="sm" className="text-typography-400">*Final price may vary based on duration</Text>
            </VStack>
          </Box>

          <Button 
            size="lg" 
            className="mt-6" 
            isDisabled={isLoading} 
            onPress={handleBooking}
          >
            <ButtonText>{isLoading ? 'Submitting...' : 'Confirm Request'}</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
