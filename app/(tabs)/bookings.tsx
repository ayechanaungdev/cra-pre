import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OwnerBookings from '../../components/OwnerBookings';
import RenterBookings from '../../components/RenterBookings';
import { useAuthStore } from '../../store/useAuthStore';

import { Box } from '@/components/ui/box';

export default function BookingsSwitcher() {
  const { profile } = useAuthStore();
  const isOwner = profile?.role === 'car_owner';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Box className="flex-1 p-4">
        {isOwner ? <OwnerBookings /> : <RenterBookings />}
      </Box>
    </SafeAreaView>
  );
}
