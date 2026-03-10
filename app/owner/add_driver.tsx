import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/upload';
import { useAuthStore } from '../../store/useAuthStore';

export default function AddDriverScreen() {
  const router = useRouter();
  const toast = useToast();
  const { profile } = useAuthStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePickPhoto = async () => {
    try {
      const url = await uploadImage('', 'car-images', `driver_${Date.now()}`);
      if (url) setPhotoUrl(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDriver = async () => {
    if (!name || !phone) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="warning" variant="solid">
              <VStack space="xs">
                <ToastTitle>Missing Info</ToastTitle>
                <ToastDescription>Name and phone are required.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      return;
    }

    setIsLoading(true);
      const { error } = await (supabase
        .from('drivers') as any)
        .insert({
          owner_id: profile.id,
          name,
          phone,
          photo_url: photoUrl,
          status: 'available'
        });

    if (error) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>{error.message}</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      setIsLoading(false);
    } else {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="success" variant="solid">
              <VStack space="xs">
                <ToastTitle>Driver Added</ToastTitle>
                <ToastDescription>The driver is now in your fleet.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      router.replace('/(tabs)/drivers');
    }
  };

  return (
    <ScrollView className="bg-white">
      <Box className="flex-1 p-6">
        <VStack space="xl" className="mt-4">
          <Center>
            <Heading size="xl">Add New Driver</Heading>
            <Text size="sm" className="text-typography-500">Register a driver for your fleet</Text>
          </Center>

          <Center className="mt-4">
            <Pressable onPress={handlePickPhoto}>
              <Box className="relative">
                <Avatar size="2xl">
                  <AvatarFallbackText>{name || 'D'}</AvatarFallbackText>
                  {photoUrl && <AvatarImage source={{ uri: photoUrl }} alt="Driver photo" />}
                </Avatar>
                <Center 
                  className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full"
                >
                  <Icon as={Camera} className="text-white w-4 h-4" />
                </Center>
              </Box>
            </Pressable>
            <Text size="xs" className="text-typography-500 mt-2">Tap to upload photo</Text>
          </Center>

          <VStack space="md">
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText>Full Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="e.g. Aung Aung" 
                  value={name}
                  onChangeText={setName}
                />
              </Input>
            </FormControl>

            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText>Phone Number</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="e.g. 0912345678" 
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </Input>
            </FormControl>

            <Button 
              size="lg" 
              className="mt-6" 
              isDisabled={isLoading} 
              onPress={handleAddDriver}
            >
              <ButtonText>{isLoading ? 'Adding...' : 'Add Driver'}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
