import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';

export default function SignupScreen() {
  const router = useRouter();
  const toast = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nrc, setNrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !fullName || !nrc) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="warning" variant="solid">
              <VStack space="xs">
                <ToastTitle>Missing Info</ToastTitle>
                <ToastDescription>Please fill all fields.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'renter',
          nrc: nrc,
        },
      },
    });

    if (error) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Signup Error</ToastTitle>
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
                <ToastTitle>Success!</ToastTitle>
                <ToastDescription>Please check your email to verify.</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
      router.replace('/auth/login');
    }
  };

  return (
    <ScrollView className="bg-white dark:bg-black">
      <Box className="flex-1 p-6">
        <VStack space="xl">
          <Center className="mt-4">
            <Heading size="2xl">Create Account</Heading>
            <Text size="sm" className="text-typography-500">Join the Myanmar Car Rental network</Text>
          </Center>

          <VStack space="md">
            <FormControl size="md">
              <FormControlLabel>
                <FormControlLabelText>Full Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="John Doe" 
                  value={fullName}
                  onChangeText={setFullName}
                />
              </Input>
            </FormControl>

            <FormControl size="md">
              <FormControlLabel>
                <FormControlLabelText>National ID (NRC)</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="12/YAKANA(N)123456" 
                  value={nrc}
                  onChangeText={setNrc}
                />
              </Input>
            </FormControl>

            <FormControl size="md">
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  placeholder="email@example.com" 
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </Input>
            </FormControl>

            <FormControl size="md">
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField 
                  type="password" 
                  placeholder="At least 6 characters" 
                  value={password}
                  onChangeText={setPassword}
                />
              </Input>
            </FormControl>
            <Button 
              isDisabled={isLoading} 
              onPress={handleSignup}
              className="mt-4"
            >
              <ButtonText>{isLoading ? 'Creating Account...' : 'Sign Up'}</ButtonText>
            </Button>
          </VStack>

          <Center className="mt-4 mb-10">
            <HStack space="xs">
              <Text size="sm" className="text-typography-500">Already have an account?</Text>
              <Button variant="link" size="sm" onPress={() => router.push('/auth/login')}>
                <ButtonText className="text-primary-600">Login</ButtonText>
              </Button>
            </HStack>
          </Center>
        </VStack>
      </Box>
    </ScrollView>
  );
}
