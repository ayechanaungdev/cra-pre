import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface ChatPreview {
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchChats();
    }
  }, [session]);

  const fetchChats = async () => {
    if (!session?.user) return;
    
    // This is a simplified version. In a real app, you'd use a more complex query 
    // or a view to get distinct conversations and the latest message.
    const { data, error } = await supabase
      .from('messages')
      // @ts-ignore
      .select('*, sender:sender_id(full_name), receiver:receiver_id(full_name)')
      .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
      .order('created_at', { ascending: false });

    // Mocking the aggregation for now
    if (data) {
      setChats([
        {
          other_user_id: '123',
          other_user_name: 'Min Min',
          last_message: 'Is the car available tomorrow?',
          last_message_time: '10:30 AM',
          unread_count: 2
        },
        {
          other_user_id: '456',
          other_user_name: 'Kyaw Kyaw',
          last_message: 'Thanks for the ride!',
          last_message_time: 'Yesterday',
          unread_count: 0
        }
      ]);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Box className="flex-1">
        <VStack space="md" className="p-4 flex-1">
          <Heading size="xl">Messages</Heading>
          
          {isLoading ? (
            <Center className="flex-1"><Spinner /></Center>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <VStack space="md">
                {chats.map((chat) => (
                  <Pressable 
                    key={chat.other_user_id} 
                    onPress={() => router.push(`/messages/${chat.other_user_id}`)}
                  >
                    <Card className="p-4 bg-white dark:bg-background-900 shadow-soft-1" variant="elevated">
                      <HStack space="md" className="items-center">
                        <Avatar size="md">
                          <AvatarFallbackText>{chat.other_user_name}</AvatarFallbackText>
                        </Avatar>
                        <VStack className="flex-1">
                          <HStack className="justify-between">
                            <Heading size="sm">{chat.other_user_name}</Heading>
                            <Text size="xs" className="text-typography-500">{chat.last_message_time}</Text>
                          </HStack>
                          <HStack className="justify-between items-center">
                            <Text 
                              size="xs" 
                              className={`${chat.unread_count > 0 ? 'text-typography-900 font-bold' : 'text-typography-500 font-normal'} flex-1`}
                              numberOfLines={1}
                            >
                              {chat.last_message}
                            </Text>
                            {chat.unread_count > 0 && (
                              <Box className="bg-primary-600 rounded-full px-2 py-0.5 ml-2">
                                <Text size="xs" className="text-white">{chat.unread_count}</Text>
                              </Box>
                            )}
                          </HStack>
                        </VStack>
                      </HStack>
                    </Card>
                  </Pressable>
                ))}
                {chats.length === 0 && (
                  <Center className="mt-10">
                    <Text className="text-typography-500">No conversations yet.</Text>
                  </Center>
                )}
              </VStack>
            </ScrollView>
          )}
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

