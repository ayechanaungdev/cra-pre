import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function Index() {
  const { session, hasCompletedOnboarding, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/auth/start" />;
}
