import { Camera, CheckCircle, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/upload';
import { useAuthStore } from '../../store/useAuthStore';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';

export default function ProfileScreen() {
  const { profile, session, signOut, setProfile } = useAuthStore();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const handleUploadAvatar = async () => {
    if (!session?.user) return;
    
    setIsAvatarUploading(true);
    try {
      // Bucket: 'profile-images', Path: user_id
      const publicUrl = await uploadImage('', 'profile-images', session.user.id);
      
      if (publicUrl) {
        const { error } = await (supabase
          .from('profiles') as any)
          .update({ avatar_url: publicUrl })
          .eq('id', session.user.id);
        
        if (error) throw error;
        
        // Update local store
        if (profile) setProfile({ ...profile, avatar_url: publicUrl });

        toast.show({
          placement: "top",
          render: ({ id }) => {
            const toastId = "toast-" + id;
            return (
              <Toast nativeID={toastId} action="success" variant="solid">
                <VStack space="xs">
                  <ToastTitle>Profile Picture Updated</ToastTitle>
                  <ToastDescription>Your profile picture has been updated.</ToastDescription>
                </VStack>
              </Toast>
            );
          }
        });
      }
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Update Failed</ToastTitle>
                <ToastDescription>{error.message}</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleUploadLicense = async () => {
    if (!session?.user) return;
    
    setIsUploading(true);
    try {
      // Bucket: 'licenses', Path: user_id
      const publicUrl = await uploadImage('', 'licenses', session.user.id);
      
      if (publicUrl) {
        const { error } = await (supabase
          .from('profiles') as any)
          .update({ license_url: publicUrl })
          .eq('id', session.user.id);
        
        if (error) throw error;
        
        // Update local store
        if (profile) setProfile({ ...profile, license_url: publicUrl });

        toast.show({
          placement: "top",
          render: ({ id }) => {
            const toastId = "toast-" + id;
            return (
              <Toast nativeID={toastId} action="success" variant="solid">
                <VStack space="xs">
                  <ToastTitle>Upload Success</ToastTitle>
                  <ToastDescription>Your license has been uploaded.</ToastDescription>
                </VStack>
              </Toast>
            );
          }
        });
      }
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Upload Failed</ToastTitle>
                <ToastDescription>{error.message}</ToastDescription>
              </VStack>
            </Toast>
          );
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView className="bg-white dark:bg-black">
      <Box className="flex-1 p-6">
        <VStack space="xl">
          <Center className="mt-4">
            <Pressable onPress={handleUploadAvatar} disabled={isAvatarUploading}>
              <Box className="relative">
                <Avatar size="xl">
                  <AvatarFallbackText>{profile?.full_name || 'U'}</AvatarFallbackText>
                  {profile?.avatar_url && <AvatarImage source={{ uri: profile.avatar_url }} alt="Profile picture" />}
                </Avatar>
                {isAvatarUploading ? (
                  <Box className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 rounded-full justify-center items-center">
                    <Spinner className="text-white" />
                  </Box>
                ) : (
                  <Box className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full border-2 border-white">
                    <Icon as={Camera} className="text-white w-4 h-4" />
                  </Box>
                )}
              </Box>
            </Pressable>
            <Heading size="xl" className="mt-4">{profile?.full_name}</Heading>
            <Text size="sm" className="text-typography-500">{profile?.role?.toUpperCase()}</Text>
          </Center>

          <Divider />

          <VStack space="md">
            <ProfileItem label="Email" value={session?.user?.email ?? 'N/A'} />
            <ProfileItem label="NRC Number" value={profile?.nrc || 'Not set'} />
            <ProfileItem label="Phone" value={profile?.phone || 'Not set'} />
          </VStack>

          <Divider />

          <VStack space="sm">
            <Heading size="sm">Driver's License</Heading>
            {profile?.license_url ? (
              <HStack space="xs" className="items-center bg-success-50 p-3 rounded-md">
                <Icon as={CheckCircle} className="text-success-600 w-5 h-5" />
                <Text size="sm" className="text-success-600">Verification Document Uploaded</Text>
              </HStack>
            ) : (
              <Button 
                variant="outline" 
                action="primary" 
                onPress={handleUploadLicense}
                isDisabled={isUploading}
              >
                {isUploading ? <Spinner className="text-primary-600 mr-2" /> : <Icon as={Upload} className="text-primary-600 mr-2 w-5 h-5" />}
                <ButtonText>Upload License Photo</ButtonText>
              </Button>
            )}
          </VStack>

          <Button action="negative" variant="outline" onPress={signOut} className="mt-8">
            <ButtonText>Logout</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}

function ProfileItem({ label, value }: any) {
  return (
    <Box>
      <Text className="font-bold text-xs text-typography-500 mb-1">{label.toUpperCase()}</Text>
      <Text size="md">{value}</Text>
    </Box>
  );
}
