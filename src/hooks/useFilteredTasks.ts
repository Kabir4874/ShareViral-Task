import { useMemo } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { FilterStatus, SortOption, Task } from '@/types/task';

export function filterAndSortTasks(
  tasks: Task[],
  query: string,
  selectedCategory: string,
  statusFilter: FilterStatus,
  sortOption: SortOption
): Task[] {
  const queryLower = query.toLowerCase();

  const filtered = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(queryLower) ||
      task.description.toLowerCase().includes(queryLower);

    const matchesCategory = selectedCategory === 'all' || task.categoryId === selectedCategory;

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return filtered.sort((a, b) => {
    if (sortOption === 'dueDateAsc') {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortOption === 'dueDateDesc') {
      return b.dueDate.localeCompare(a.dueDate);
    }
    if (sortOption === 'createdAtDesc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === 'createdAtAsc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });
}

export function useFilteredTasks(
  tasks: Task[],
  searchQuery: string,
  selectedCategory: string,
  statusFilter: FilterStatus,
  sortOption: SortOption
): Task[] {
  const debouncedQuery = useDebounce(searchQuery, 300);

  return useMemo(
    () => filterAndSortTasks(tasks, debouncedQuery, selectedCategory, statusFilter, sortOption),
    [tasks, debouncedQuery, selectedCategory, statusFilter, sortOption]
  );
}
