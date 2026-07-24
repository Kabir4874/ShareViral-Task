export type FilterStatus = 'all' | 'open' | 'done';

export type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'createdAtDesc' | 'createdAtAsc';

export interface Category {
  id: string;
  name: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  status: 'open' | 'done';
  dueDate: string;
  createdAt: string;
  isStarred: boolean;
}

export type { TaskState } from './store';
