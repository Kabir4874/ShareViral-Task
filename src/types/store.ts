import { Category, FilterStatus, SortOption, Task } from './task';

export interface TaskState {
  tasks: Task[];
  categories: Category[];
  selectedCategory: string;
  statusFilter: FilterStatus;
  sortOption: SortOption;
  searchQuery: string;
  isLoading: boolean;
  isSyncing: boolean;
  isOffline: boolean;
  lastSyncedAt: string | null;

  // Actions
  setIsOffline: (offline: boolean) => void;
  fetchInitialData: () => Promise<void>;
  refreshData: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  toggleTaskStar: (id: string) => Promise<void>;
  addCategory: (name: string, color: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateCategory: (id: string, name: string, color: string) => Promise<void>;
  setSelectedCategory: (categoryId: string) => void;
  setStatusFilter: (status: FilterStatus) => void;
  setSortOption: (sort: SortOption) => void;
  setSearchQuery: (query: string) => void;
}
