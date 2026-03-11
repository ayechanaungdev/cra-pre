import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { Car, Clock, DollarSign, Star } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';

import { useOwnerStatsQuery } from '@/hooks/queries/useOwnerStatsQuery';

import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { useBookingsRealtime } from '@/hooks/useBookingsRealtime';
import { useCarsRealtime } from '@/hooks/useCarsRealtime';

export default function OwnerDashboard() {
  const router = useRouter();
  const { profile } = useAuthStore();
  
  const { data: stats, isLoading } = useOwnerStatsQuery(profile?.id);

  // Subscribe to changes to ensure dashboard metrics are always live
  useBookingsRealtime();
  useCarsRealtime();

  if (isLoading || !stats) {
    return (
      <Center className="flex-1 bg-white dark:bg-black">
        <Spinner size="large" />
      </Center>
    );
  }

  return (
    <ScrollView className="p-4 bg-white dark:bg-black">
      <VStack space="lg" className="pb-20">
        <VStack space="xs" className="mt-4">
          <Heading size="xl">Owner Dashboard</Heading>
          <Text size="sm" className="text-typography-500">Overview of your car rental business</Text>
        </VStack>

        <HStack space="md" className="flex-wrap">
          <StatCard 
            title="Earnings" 
            value={`$${stats.totalEarnings}`} 
            icon={DollarSign} 
            color="text-success-600" 
          />
          <StatCard 
            title="Cars" 
            value={stats.activeCars.toString()} 
            icon={Car} 
            color="text-primary-600" 
          />
          <Pressable onPress={() => router.push('/(tabs)/bookings')}>
            <StatCard 
              title="Pending" 
              value={stats.pendingBookings.toString()} 
              icon={Clock} 
              color="text-warning-600" 
            />
          </Pressable>
          <StatCard 
            title="Rating" 
            value={stats.averageRating.toString()} 
            icon={Star} 
            color="text-info-600" 
          />
        </HStack>

        <Heading size="md" className="mt-4">Recent Activity</Heading>
        <Card className="p-4 bg-white dark:bg-background-900 border border-outline-50">
          <VStack space="md">
            <ActivityItem 
              title="New Booking Request" 
              desc="Toyota Crown - 3 days" 
              time="2h ago" 
            />
            <Divider />
            <ActivityItem 
              title="Review Received" 
              desc="5 stars from Aung Aung" 
              time="5h ago" 
            />
            <Divider />
            <ActivityItem 
              title="Booking Completed" 
              desc="Honda Insight - Tomorrow" 
              time="1d ago" 
            />
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <Card 
      className="p-4 flex-1 min-w-[140px] bg-white dark:bg-background-900 mb-2 border border-outline-50"
      variant="outline"
    >
      <VStack space="xs">
        <HStack className="justify-between items-center">
          <Text size="xs" className="text-typography-500 font-bold">{title.toUpperCase()}</Text>
          <Icon as={icon} className={`w-4 h-4 ${color}`} />
        </HStack>
        <Heading size="lg">{value}</Heading>
      </VStack>
    </Card>
  );
}

function ActivityItem({ title, desc, time }: any) {
  return (
    <HStack className="justify-between items-center">
      <VStack>
        <Text className="font-bold text-sm text-typography-900">{title}</Text>
        <Text size="xs" className="text-typography-500">{desc}</Text>
      </VStack>
      <Text size="xs" className="text-typography-400">{time}</Text>
    </HStack>
  );
}
