import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { session, profile, isLoading, hasCompletedOnboarding } = useAuthStore();
  const isOwner = profile?.role === 'car_owner';

  if (isLoading) {
    return null;
  }

  if (!session) {
    if (hasCompletedOnboarding) {
      return <Redirect href="/auth/login" />;
    }
    return <Redirect href="/auth/start" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: isOwner ? 'Dashboard' : 'Cars',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="owner_cars"
        options={{
          title: 'My Cars',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="car.fill" color={color} />,
          href: isOwner ? '/owner_cars' : null,
        }}
      />
      <Tabs.Screen
        name="drivers"
        options={{
          title: 'Drivers',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
          href: isOwner ? '/drivers' : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      {/* Hide default explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>

  );
}
