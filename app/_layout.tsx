import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '../global.css';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // Useful for mobile to prevent over-fetching
    },
  },
});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { session, profile, initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  console.log('RootLayout Render:', { isLoading, session: !!session });

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 12, color: '#666' }}>Initializing app...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
