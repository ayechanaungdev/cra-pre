import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    title: 'Welcome to CarRental',
    description: 'The premium car sharing platform in Myanmar. Rent your dream car or list your own with ease.',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Find Your Perfect Ride',
    description: 'Browse through a wide variety of cars, from luxury sedans to rugged SUVs, all verified for your safety.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Earn with Your Car',
    description: 'Turn your car into an asset. List your vehicle and start earning passive income today.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  },
];

export default function StartScreen() {
  const router = useRouter();
  const { completeOnboarding, hasCompletedOnboarding, session, isLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);

  // If loading, or already completed, or logged in, show nothing while layout redirects
  if (isLoading || hasCompletedOnboarding || session) {
    return <View className="flex-1 bg-white dark:bg-black" />;
  }

  const handleNext = async () => {
    if (currentStep < ONBOARDING_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
      router.replace('/auth/login');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/auth/login');
  };

  const currentData = ONBOARDING_DATA[currentStep];

  return (
    <Box className="flex-1 bg-white dark:bg-black">
      <View className="flex-1">
        <Image
          source={{ uri: currentData.image }}
          alt={currentData.title}
          className="h-[60%] w-full"
        />
        
        <Box className="flex-1 bg-white dark:bg-black rounded-t-[40px] -mt-10 px-8 pt-10">
          <VStack space="xl" className="flex-1">
            <VStack space="md">
              <HStack space="xs" className="mb-2">
                {ONBOARDING_DATA.map((_, index) => (
                  <Box
                    key={index}
                    className={`h-1.5 rounded-full ${
                      index === currentStep ? 'w-8 bg-primary-600' : 'w-2 bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                ))}
              </HStack>
              
              <Heading size="3xl" className="text-typography-900 leading-[40px]">
                {currentData.title}
              </Heading>
              
              <Text size="lg" className="text-typography-500 leading-7">
                {currentData.description}
              </Text>
            </VStack>

            <Box className="mt-auto mb-10">
              <HStack space="md" className="items-center">
                {currentStep < ONBOARDING_DATA.length - 1 ? (
                  <>
                    <Button
                      variant="outline"
                      action="secondary"
                      className="flex-1 border-none"
                      onPress={handleSkip}
                    >
                      <ButtonText className="text-typography-500">Skip</ButtonText>
                    </Button>
                    <Button
                      size="xl"
                      className="flex-1 rounded-2xl h-14"
                      onPress={handleNext}
                    >
                      <ButtonText>Next</ButtonText>
                      <ButtonIcon as={ArrowRight} className="ml-2" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="xl"
                    className="w-full rounded-2xl h-14"
                    onPress={handleNext}
                  >
                    <ButtonText>Get Started</ButtonText>
                  </Button>
                )}
              </HStack>
            </Box>
          </VStack>
        </Box>
      </View>
    </Box>
  );
}
