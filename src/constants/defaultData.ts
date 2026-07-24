import { Category, Task } from '@/types/task';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-work',
    name: 'Work',
    color: '#4f46e5',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
  },
  {
    id: 'cat-personal',
    name: 'Personal',
    color: '#10b981',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
  },
  {
    id: 'cat-health',
    name: 'Health',
    color: '#f43f5e',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
  },
  {
    id: 'cat-shopping',
    name: 'Shopping',
    color: '#f59e0b',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize Q3 Revenue Deck',
    description:
      'Review financial metrics with executive team, format charts, and compile revenue growth slides.',
    categoryId: 'cat-work',
    status: 'open',
    dueDate: '2026-07-25',
    createdAt: '2026-07-20T10:00:00Z',
    isStarred: true,
  },
  {
    id: 'task-2',
    title: 'Morning Interval Cardio & Core',
    description: '30-minute high-intensity cardio workout followed by core endurance routines.',
    categoryId: 'cat-health',
    status: 'open',
    dueDate: '2026-07-23',
    createdAt: '2026-07-21T08:30:00Z',
    isStarred: false,
  },
  {
    id: 'task-3',
    title: 'Buy Organic Groceries & Produce',
    description: 'Fresh avocados, almond milk, sourdough bread, and eco household cleaners.',
    categoryId: 'cat-shopping',
    status: 'done',
    dueDate: '2026-07-22',
    createdAt: '2026-07-19T14:15:00Z',
    isStarred: false,
  },
  {
    id: 'task-4',
    title: 'UI Design System Audit',
    description:
      'Refactor atomic component colors, verify accessibility contrast scores, and optimize NativeWind theme tokens.',
    categoryId: 'cat-work',
    status: 'open',
    dueDate: '2026-07-28',
    createdAt: '2026-07-22T09:00:00Z',
    isStarred: true,
  },
  {
    id: 'task-5',
    title: 'Reserve Vacation Flight Tickets',
    description: 'Compare airline flight schedules and book round-trip tickets for summer retreat.',
    categoryId: 'cat-personal',
    status: 'open',
    dueDate: '2026-07-30',
    createdAt: '2026-07-18T16:45:00Z',
    isStarred: false,
  },
];
