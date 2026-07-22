import React, { createContext, useContext, useState } from 'react';

import { Category, FilterStatus, SortOption, Task } from '@/types/task';

const DEFAULT_CATEGORIES: Category[] = [
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

const DEFAULT_TASKS: Task[] = [
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

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  selectedCategory: string;
  statusFilter: FilterStatus;
  sortOption: SortOption;
  searchQuery: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  toggleTaskStar: (id: string) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, name: string, color: string) => void;
  setSelectedCategory: (categoryId: string) => void;
  setStatusFilter: (status: FilterStatus) => void;
  setSortOption: (sort: SortOption) => void;
  setSearchQuery: (query: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('dueDateAsc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: task.status === 'open' ? 'done' : 'open' } : task
      )
    );
  };

  const toggleTaskStar = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isStarred: !task.isStarred } : task))
    );
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      color,
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-700',
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    // Move tasks in deleted category to uncategorized if any
  };

  const updateCategory = (id: string, name: string, color: string) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, name, color } : cat)));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        selectedCategory,
        statusFilter,
        sortOption,
        searchQuery,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        toggleTaskStar,
        addCategory,
        deleteCategory,
        updateCategory,
        setSelectedCategory,
        setStatusFilter,
        setSortOption,
        setSearchQuery,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
