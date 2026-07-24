import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

export const SUPABASE_URL: string =
  (process.env.EXPO_PUBLIC_SUPABASE_URL as string) || (extra.supabaseUrl as string) || '';

export const SUPABASE_ANON_KEY: string =
  (process.env.EXPO_PUBLIC_SUPABASE_KEY as string) || (extra.supabaseAnonKey as string) || '';
