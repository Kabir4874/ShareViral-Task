import { appStorage } from '@/lib/storage';
import { Category, Task } from '@/types/task';

const TASKS_CACHE_KEY = 'shareviral_cached_tasks';
const CATEGORIES_CACHE_KEY = 'shareviral_cached_categories';
const STARRED_MAP_KEY = 'shareviral_local_starred_map';
const LAST_SYNCED_KEY = 'shareviral_last_synced_at';

export const cacheService = {
  getCachedTasks(): Task[] | null {
    try {
      const raw = appStorage.getItem(TASKS_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading cached tasks:', e);
    }
    return null;
  },

  setCachedTasks(tasks: Task[]): void {
    try {
      appStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Error setting cached tasks:', e);
    }
  },

  getCachedCategories(): Category[] | null {
    try {
      const raw = appStorage.getItem(CATEGORIES_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading cached categories:', e);
    }
    return null;
  },

  setCachedCategories(categories: Category[]): void {
    try {
      appStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.warn('Error setting cached categories:', e);
    }
  },

  getLocalStarredMap(): Record<string, boolean> {
    try {
      const raw = appStorage.getItem(STARRED_MAP_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading local starred map:', e);
    }
    return {};
  },

  setTaskStarredLocally(taskId: string, isStarred: boolean): void {
    try {
      const currentMap = this.getLocalStarredMap();
      currentMap[taskId] = isStarred;
      appStorage.setItem(STARRED_MAP_KEY, JSON.stringify(currentMap));
    } catch (e) {
      console.warn('Error setting task starred locally:', e);
    }
  },

  getLastSyncedAt(): string | null {
    try {
      return appStorage.getItem(LAST_SYNCED_KEY);
    } catch (e) {
      console.warn('Error reading last synced timestamp:', e);
      return null;
    }
  },

  setLastSyncedAt(timestamp: string): void {
    try {
      appStorage.setItem(LAST_SYNCED_KEY, timestamp);
    } catch (e) {
      console.warn('Error setting last synced timestamp:', e);
    }
  },
};
