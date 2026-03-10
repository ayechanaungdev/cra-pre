import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const ONBOARDING_KEY = 'has_completed_onboarding';

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  hasCompletedOnboarding: false,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),

  initialize: async () => {
    set({ isLoading: true });
    try {
      // Check onboarding status
      const onboardingStatus = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({ hasCompletedOnboarding: onboardingStatus === 'true' });

      // Refresh session if it exists
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        // If there's a session error (like invalid refresh token), sign out to clear state
        await supabase.auth.signOut();
        set({ session: null, user: null, profile: null });
      } else {
        set({ session, user: session?.user ?? null });

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          set({ profile });
        }
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          set({ session: null, user: null, profile: null, isLoading: false });
          return;
        }

        set({ session, user: session?.user ?? null });
        
        if (session?.user) {
          set({ isLoading: true });
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile on auth change:', profileError.message);
          }
          set({ profile, isLoading: false });
        } else {
          set({ profile: null, isLoading: false });
        }
      });
    } catch (error) {
      console.error('Unexpected error initializing auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      set({ hasCompletedOnboarding: true });
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  },

  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      set({ hasCompletedOnboarding: false });
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },
}));
