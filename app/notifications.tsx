import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { CircleIcon, Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function NotificationsScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    const { data } = await (supabase
      .from('notifications' as any) as any)
      .select('*')
      .eq('user_id', session!.user.id)
      .order('created_at', { ascending: false });
    
    // Mocking for now
    if (data && data.length > 0) {
      setNotifications(data);
    } else {
      setNotifications([
        {
          id: '1',
          title: 'Booking Approved!',
          content: 'Your request for Toyota Crown has been approved.',
          created_at: new Date().toISOString(),
          is_read: false
        },
        {
          id: '2',
          title: 'New Message',
          content: 'Min Min sent you a message.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: true
        }
      ]);
    }
  };

  return (
    <Box className="flex-1 bg-white dark:bg-black">
      <VStack space="md" className="p-4 flex-1">
        <HStack className="justify-between items-center mt-4">
          <Heading size="xl">Notifications</Heading>
          <Icon as={Bell} className="text-primary-600 w-6 h-6" />
        </HStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="md">
            {notifications.map((notif) => (
              <Pressable key={notif.id} onPress={() => {}}>
                <Card className={`p-4 ${notif.is_read ? 'bg-white dark:bg-background-900' : 'bg-background-50 dark:bg-background-800'}`} variant="elevated">
                  <VStack space="xs">
                    <HStack className="justify-between items-center">
                      <HStack space="xs" className="items-center">
                        {!notif.is_read && <Icon as={CircleIcon} className="w-3 h-3 text-primary-600" />}
                        <Heading size="xs">{notif.title}</Heading>
                      </HStack>
                      <Text size="xs" className="text-typography-400">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </Text>
                    </HStack>
                    <Text size="sm" className="text-typography-600">{notif.content}</Text>
                  </VStack>
                </Card>
              </Pressable>
            ))}
            {notifications.length === 0 && (
              <Center className="mt-10">
                <Text className="text-typography-500">No notifications yet.</Text>
              </Center>
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}
