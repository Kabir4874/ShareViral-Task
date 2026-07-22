export type FilterStatus = 'all' | 'open' | 'done';

export type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'createdAtDesc' | 'createdAtAsc';

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color code or hex e.g. '#6366f1' or 'indigo'
  badgeBg: string; // Tailwind class e.g. 'bg-indigo-100'
  badgeText: string; // Tailwind class e.g. 'text-indigo-700'
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
