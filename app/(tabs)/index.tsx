import OwnerDashboard from '@/components/OwnerDashboard';
import RenterHome from '@/components/RenterHome';
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react';

import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';

export default function HomeScreen() {
  const { session, profile, isLoading } = useAuthStore();

  // Show spinner if we're loading OR if we have a session but don't know the role yet
  if (isLoading || (session && !profile)) {
    return (
      <Center className="flex-1 bg-white dark:bg-black">
        <Spinner size="large" />
      </Center>
    );
  }

  return (
    <Box className="flex-1 bg-white dark:bg-black">
      {profile?.role === 'car_owner' ? (
        <OwnerDashboard />
      ) : (
        <RenterHome />
      )}
    </Box>
  );
}
