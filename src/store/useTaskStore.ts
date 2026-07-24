import { Alert } from 'react-native';
import { create } from 'zustand';

import { DEFAULT_CATEGORIES, DEFAULT_TASKS } from '@/constants/defaultData';
import { cacheService } from '@/services/cacheService';
import { supabaseService } from '@/services/supabaseService';
import { TaskState } from '@/types/store';
import { Category, FilterStatus, SortOption, Task } from '@/types/task';

const getInitialTasks = (): Task[] => {
  const cached = cacheService.getCachedTasks();
  const starredMap = cacheService.getLocalStarredMap();
  const baseTasks = cached && cached.length > 0 ? cached : DEFAULT_TASKS;

  return baseTasks.map((t) => {
    if (Object.prototype.hasOwnProperty.call(starredMap, t.id)) {
      return { ...t, isStarred: starredMap[t.id] };
    }
    return t;
  });
};

const getInitialCategories = (): Category[] => {
  const cached = cacheService.getCachedCategories();
  return cached && cached.length > 0 ? cached : DEFAULT_CATEGORIES;
};

const handleWriteError = (actionName: string, error: unknown) => {
  console.warn(`Backend ${actionName} notice:`, error);
  Alert.alert(
    'Action Failed (Offline)',
    `Could not ${actionName}. Backend is unavailable or the write failed. Your local cache remains untouched.`
  );
};

const mergeRemoteTasksWithLocalStarred = (
  remoteTasks: Task[],
  currentLocalTasks: Task[]
): Task[] => {
  const localStarredMap = cacheService.getLocalStarredMap();
  const currentTaskMap = new Map(currentLocalTasks.map((t) => [t.id, t]));

  return remoteTasks.map((remoteTask) => {
    if (Object.prototype.hasOwnProperty.call(localStarredMap, remoteTask.id)) {
      return {
        ...remoteTask,
        isStarred: localStarredMap[remoteTask.id],
      };
    }
    const existingLocal = currentTaskMap.get(remoteTask.id);
    if (existingLocal !== undefined) {
      return {
        ...remoteTask,
        isStarred: existingLocal.isStarred,
      };
    }
    return remoteTask;
  });
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: getInitialTasks(),
  categories: getInitialCategories(),
  selectedCategory: 'all',
  statusFilter: 'all',
  sortOption: 'dueDateAsc',
  searchQuery: '',
  isLoading: false,
  isSyncing: false,
  isOffline: false,
  lastSyncedAt: cacheService.getLastSyncedAt(),

  setIsOffline: (offline: boolean) => set({ isOffline: offline }),
  setSelectedCategory: (categoryId: string) => set({ selectedCategory: categoryId }),
  setStatusFilter: (status: FilterStatus) => set({ statusFilter: status }),
  setSortOption: (sort: SortOption) => set({ sortOption: sort }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  fetchInitialData: async () => {
    set({ isLoading: true, isSyncing: true });
    try {
      const [remoteCategories, remoteTasks] = await Promise.all([
        supabaseService.getCategories(),
        supabaseService.getTasks(),
      ]);

      if (remoteCategories.length > 0) {
        set({ categories: remoteCategories });
        cacheService.setCachedCategories(remoteCategories);
      }
      if (remoteTasks.length > 0) {
        const mergedTasks = mergeRemoteTasksWithLocalStarred(remoteTasks, get().tasks);
        set({ tasks: mergedTasks });
        cacheService.setCachedTasks(mergedTasks);
      }
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ isOffline: false, lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (error) {
      console.warn('Initial fetch offline notice:', error);
      set({ isOffline: true });
    } finally {
      set({ isLoading: false, isSyncing: false });
    }
  },

  refreshData: async () => {
    set({ isLoading: true, isSyncing: true });
    try {
      const [remoteCategories, remoteTasks] = await Promise.all([
        supabaseService.getCategories(),
        supabaseService.getTasks(),
      ]);

      if (remoteCategories.length > 0) {
        set({ categories: remoteCategories });
        cacheService.setCachedCategories(remoteCategories);
      }
      if (remoteTasks.length > 0) {
        const mergedTasks = mergeRemoteTasksWithLocalStarred(remoteTasks, get().tasks);
        set({ tasks: mergedTasks });
        cacheService.setCachedTasks(mergedTasks);
      }
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ isOffline: false, lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (error) {
      console.warn('Refresh notice:', error);
      set({ isOffline: true });
    } finally {
      set({ isLoading: false, isSyncing: false });
    }
  },

  addTask: async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await supabaseService.addTask(newTask);
      if (!result) {
        set({ isOffline: true });
        handleWriteError('add task', 'Operation failed on server');
        return;
      }
      const updatedTasks = [newTask, ...get().tasks];
      set({ tasks: updatedTasks, isOffline: false });
      cacheService.setCachedTasks(updatedTasks);
      cacheService.setTaskStarredLocally(newTask.id, newTask.isStarred);
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (err) {
      set({ isOffline: true });
      handleWriteError('add task', err);
    }
  },

  updateTask: async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    try {
      const success = await supabaseService.updateTask(id, updates);
      if (!success) {
        set({ isOffline: true });
        handleWriteError('update task', 'Operation failed on server');
        return;
      }
      if (updates.isStarred !== undefined) {
        cacheService.setTaskStarredLocally(id, updates.isStarred);
      }
      const updatedTasks = get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      set({ tasks: updatedTasks, isOffline: false });
      cacheService.setCachedTasks(updatedTasks);
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (err) {
      set({ isOffline: true });
      handleWriteError('update task', err);
    }
  },

  deleteTask: async (id: string) => {
    try {
      const success = await supabaseService.deleteTask(id);
      if (!success) {
        set({ isOffline: true });
        handleWriteError('delete task', 'Operation failed on server');
        return;
      }
      const updatedTasks = get().tasks.filter((t) => t.id !== id);
      set({ tasks: updatedTasks, isOffline: false });
      cacheService.setCachedTasks(updatedTasks);
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (err) {
      set({ isOffline: true });
      handleWriteError('delete task', err);
    }
  },

  toggleTaskStatus: async (id: string) => {
    const targetTask = get().tasks.find((t) => t.id === id);
    if (!targetTask) return;
    const newStatus: 'open' | 'done' = targetTask.status === 'open' ? 'done' : 'open';

    try {
      const success = await supabaseService.updateTask(id, { status: newStatus });
      if (!success) {
        set({ isOffline: true });
        handleWriteError('toggle task status', 'Operation failed on server');
        return;
      }
      const updatedTasks = get().tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
      set({ tasks: updatedTasks, isOffline: false });
      cacheService.setCachedTasks(updatedTasks);
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (err) {
      set({ isOffline: true });
      handleWriteError('toggle task status', err);
    }
  },

  toggleTaskStar: async (id: string) => {
    const updatedTasks = get().tasks.map((t) => {
      if (t.id === id) {
        const updatedStar = !t.isStarred;
        cacheService.setTaskStarredLocally(id, updatedStar);
        return { ...t, isStarred: updatedStar };
      }
      return t;
    });
    set({ tasks: updatedTasks });
    cacheService.setCachedTasks(updatedTasks);
  },

  addCategory: async (name: string, color: string) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      color,
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-700',
    };

    try {
      const result = await supabaseService.addCategory(newCategory);
      if (!result) {
        set({ isOffline: true });
        handleWriteError('add category', 'Operation failed on server');
        return;
      }
      const updatedCategories = [...get().categories, newCategory];
      set({ categories: updatedCategories, isOffline: false });
      cacheService.setCachedCategories(updatedCategories);
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (err) {
      set({ isOffline: true });
      handleWriteError('add category', err);
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const success = await supabaseService.deleteCategory(id);
      if (!success) {
        set({ isOffline: true });
        handleWriteError('delete category', 'Operation failed on server');
        return;
      }
      const updatedCategories = get().categories.filter((c) => c.id !== id);
      set({ categories: updatedCategories, isOffline: false });
      cacheService.setCachedCategories(updatedCategories);
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (err) {
      set({ isOffline: true });
      handleWriteError('delete category', err);
    }
  },

  updateCategory: async (id: string, name: string, color: string) => {
    try {
      const success = await supabaseService.updateCategory(id, name, color);
      if (!success) {
        set({ isOffline: true });
        handleWriteError('update category', 'Operation failed on server');
        return;
      }
      const updatedCategories = get().categories.map((c) =>
        c.id === id ? { ...c, name, color } : c
      );
      set({ categories: updatedCategories, isOffline: false });
      cacheService.setCachedCategories(updatedCategories);
      const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ lastSyncedAt: syncTime });
      cacheService.setLastSyncedAt(syncTime);
    } catch (err) {
      set({ isOffline: true });
      handleWriteError('update category', err);
    }
  },
}));

useTaskStore.getState().fetchInitialData();

export const useTasks = useTaskStore;
