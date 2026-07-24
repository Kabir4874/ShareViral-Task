/* global jest */

jest.mock('react-native-mmkv', () => {
  const storage = new Map();
  return {
    createMMKV: jest.fn().mockImplementation(() => ({
      getString: jest.fn((key) => storage.get(key) ?? undefined),
      set: jest.fn((key, value) => storage.set(key, value)),
      remove: jest.fn((key) => storage.delete(key)),
      clearAll: jest.fn(() => storage.clear()),
    })),
    MMKV: jest.fn(),
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
  }),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      supabaseUrl: 'https://mock.supabase.co',
      supabaseAnonKey: 'mock-key',
    },
  },
}));
