import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function AddCarScreen() {
  const router = useRouter();
  const toast = useToast();
  const { profile } = useAuthStore();
  
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCar = async () => {
    if (!brand || !model || !price || !location || !profile) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="warning" variant="solid">
              <VStack space="xs">
                <ToastTitle>Missing Fields</ToastTitle>
                <ToastDescription>Please fill in all required details.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      return;
    }

    setIsLoading(true);
    
    // Explicitly casting table name to ensure types are picked up if inference fails
    const { data: car, error: carError } = await supabase
      .from('cars')
      // @ts-ignore
      .insert({
        owner_id: profile.id,
        brand,
        model,
        price_per_day: Number(price),
        location,
        description,
        status: 'pending'
      })
      .select()
      .single();

    if (carError) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>{carError.message}</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      setIsLoading(false);
    } else if (car) {
      // @ts-ignore
      await supabase.from('car_images').insert({
        car_id: car.id,
        image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
        is_primary: true
      });

      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="success" variant="solid">
              <VStack space="xs">
                <ToastTitle>Car Added!</ToastTitle>
                <ToastDescription>Your car is now pending admin approval.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      router.replace('/(tabs)/owner_cars');
    }
  };

  return (
    <ScrollView className="bg-white dark:bg-black">
      <Box className="flex-1 p-6">
        <VStack space="xl" className="mt-4">
          <Center>
            <Heading size="xl">List Your Car</Heading>
            <Text size="sm" className="text-typography-500">Earn money by sharing your vehicle</Text>
          </Center>

          <VStack space="md">
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText>Brand</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="e.g. Toyota" 
                  value={brand}
                  onChangeText={setBrand}
                />
              </Input>
            </FormControl>

            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText>Model</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="e.g. Crown" 
                  value={model}
                  onChangeText={setModel}
                />
              </Input>
            </FormControl>

            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText>Price per Day ($)</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="e.g. 50" 
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </Input>
            </FormControl>

            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText>Location</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="e.g. Yangon, Lanmadaw" 
                  value={location}
                  onChangeText={setLocation}
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Description</FormControlLabelText>
              </FormControlLabel>
              <Textarea className="h-[100px]">
                <TextareaInput 
                  placeholder="Tell us about your car..." 
                  value={description}
                  onChangeText={setDescription}
                />
              </Textarea>
            </FormControl>

            <Button 
              size="lg" 
              className="mt-6" 
              isDisabled={isLoading} 
              onPress={handleAddCar}
            >
              <ButtonText>{isLoading ? 'Adding Car...' : 'Submit for Approval'}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
