import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowUp, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id: otherUserId } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    if (session?.user && otherUserId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [session, otherUserId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${session!.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${session!.user.id})`)
      .order('created_at', { ascending: true });

    if (data) setMessages(data as any);
    setIsLoading(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          if ((newMessage.sender_id === session!.user.id && newMessage.receiver_id === (otherUserId as any)) || 
              (newMessage.sender_id === (otherUserId as any) && newMessage.receiver_id === session!.user.id)) {
            setMessages(prev => [...prev, newMessage]);
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !session?.user || !otherUserId) return;

    const content = inputText.trim();
    setInputText('');
    
    // @ts-ignore
    const { error } = await supabase.from('messages').insert({
      sender_id: session.user.id,
      receiver_id: otherUserId,
      content,
      is_read: false
    });

    if (error) {
      console.error('Send error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Box className="flex-1">
        <HStack space="md" className="p-4 items-center border-b border-outline-50">
          <Pressable onPress={() => router.back()}>
            <Icon as={ChevronLeft} />
          </Pressable>
          <Heading size="md">Chat</Heading>
        </HStack>

        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {isLoading ? (
            <Center className="flex-1"><Spinner /></Center>
          ) : (
            <VStack space="md">
              {messages.map((msg) => {
                const isMine = msg.sender_id === session!.user.id;
                return (
                  <Box 
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-[80%] ${isMine ? 'self-end bg-primary-600' : 'self-start bg-background-100'}`}
                  >
                    <Text className={`${isMine ? 'text-white' : 'text-typography-900'}`}>{msg.content}</Text>
                    <Text size="xs" className={`mt-1 text-right ${isMine ? 'text-white' : 'text-typography-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </Box>
                );
              })}
            </VStack>
          )}
        </ScrollView>

        <Box className="p-4 border-t border-outline-50">
          <HStack space="md" className="items-center">
            <Input className="flex-1 rounded-full">
              <InputField 
                placeholder="Type a message..." 
                value={inputText}
                onChangeText={setInputText}
              />
            </Input>
            <Button size="md" variant="solid" action="primary" className="rounded-full" onPress={sendMessage}>
              <ButtonIcon as={ArrowUp} />
            </Button>
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}

