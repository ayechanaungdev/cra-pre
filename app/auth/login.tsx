import { useAuthStore } from '@/store/useAuthStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LogIn } from 'lucide-react-native';
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';

export default function LoginScreen() {
  const router = useRouter();
  const toast = useToast();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const { resetOnboarding } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Login Error</ToastTitle>
                <ToastDescription>{error.message}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      setIsLoading(false);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleLogin = async () => {
    toast.show({
      placement: 'top',
      render: ({ id }) => {
        const toastId = "toast-" + id;
        return (
          <Toast nativeID={toastId} action="info" variant="solid">
            <ToastTitle>Coming Soon</ToastTitle>
            <ToastDescription>Google Login is being configured.</ToastDescription>
          </Toast>
        );
      },
    });
  };

  return (
    <Box className="flex-1 bg-white dark:bg-black p-6">
      <VStack space="xl" className="mt-10">
        <Center>
          <Icon as={LogIn} className="w-12 h-12 text-primary-600" />
          <Heading size="2xl" className="mt-2">Welcome Back</Heading>
          {role === 'car_owner' && (
            <Text size="sm" className="text-primary-600 font-bold">Logged in as Car Owner</Text>
          )}
        </Center>

        <VStack space="md" className="mt-4">
          <FormControl size="md">
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField 
                type="text" 
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
                placeholder="********" 
                value={password}
                onChangeText={setPassword}
              />
            </Input>
          </FormControl>

          <Button 
            isDisabled={isLoading} 
            onPress={handleLogin}
            className="mt-4"
          >
            <ButtonText>{isLoading ? 'Signing In...' : 'Login'}</ButtonText>
          </Button>
        </VStack>

        <HStack className="items-center mt-4">
          <Divider className="flex-1" />
          <Text size="sm" className="mx-2 text-typography-500">OR</Text>
          <Divider className="flex-1" />
        </HStack>

        <Button 
          variant="outline" 
          action="secondary" 
          onPress={handleGoogleLogin}
        >
          <ButtonText>Sign in with Google</ButtonText>
        </Button>

        <Center className="mt-4">
          <HStack space="xs">
            <Text size="sm" className="text-typography-500">Don't have an account?</Text>
            <Button variant="link" size="sm" onPress={() => router.push('/auth/signup')}>
              <ButtonText className="text-primary-600">Sign Up</ButtonText>
            </Button>
          </HStack>
        </Center>

        <Center className="mt-10">
          <Button 
            variant="link" 
            size="xs" 
            onPress={async () => {
              await resetOnboarding();
              router.replace('/auth/start');
            }}
          >
            <ButtonText className="text-typography-400">Reset Onboarding (Debug)</ButtonText>
          </Button>
        </Center>
      </VStack>
    </Box>
  );
}
