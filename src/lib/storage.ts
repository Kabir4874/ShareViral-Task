let mmkvInstance: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createMMKV } = require('react-native-mmkv');
  mmkvInstance = createMMKV({ id: 'shareviral-task-storage' });
} catch (e: any) {
  if (__DEV__ && e?.message && !e.message.includes('NitroModules')) {
    console.warn('MMKV initialization notice:', e);
  }
}

const memoryStorage = new Map<string, string>();

export const appStorage = {
  getItem: (key: string): string | null => {
    try {
      if (mmkvInstance) {
        return mmkvInstance.getString(key) ?? null;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage.get(key) ?? null;
    } catch (e) {
      console.warn('appStorage getItem notice:', e);
      return memoryStorage.get(key) ?? null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (mmkvInstance) {
        mmkvInstance.set(key, value);
        return;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      memoryStorage.set(key, value);
    } catch (e) {
      console.warn('appStorage setItem notice:', e);
      memoryStorage.set(key, value);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (mmkvInstance) {
        mmkvInstance.remove(key);
        return;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      memoryStorage.delete(key);
    } catch (e) {
      console.warn('appStorage removeItem notice:', e);
      memoryStorage.delete(key);
    }
  },
};
