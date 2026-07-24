import { filterAndSortTasks } from '@/hooks/useFilteredTasks';
import { Task } from '@/types/task';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Alpha task',
    description: 'Design system docs',
    categoryId: 'cat-work',
    status: 'open',
    dueDate: '2026-08-01',
    createdAt: '2026-07-20T10:00:00Z',
    isStarred: false,
  },
  {
    id: '2',
    title: 'Beta task',
    description: 'Grocery shopping',
    categoryId: 'cat-shopping',
    status: 'done',
    dueDate: '2026-07-25',
    createdAt: '2026-07-22T10:00:00Z',
    isStarred: true,
  },
  {
    id: '3',
    title: 'Gamma task',
    description: 'Cardio workout',
    categoryId: 'cat-health',
    status: 'open',
    dueDate: '2026-07-28',
    createdAt: '2026-07-21T10:00:00Z',
    isStarred: false,
  },
];

describe('filterAndSortTasks Logic', () => {
  it('filters tasks by search query', () => {
    const result = filterAndSortTasks(mockTasks, 'Grocery', 'all', 'all', 'dueDateAsc');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Beta task');
  });

  it('filters tasks by category ID', () => {
    const result = filterAndSortTasks(mockTasks, '', 'cat-work', 'all', 'dueDateAsc');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters tasks by status filter', () => {
    const result = filterAndSortTasks(mockTasks, '', 'all', 'done', 'dueDateAsc');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('sorts tasks by due date ascending', () => {
    const result = filterAndSortTasks(mockTasks, '', 'all', 'all', 'dueDateAsc');
    expect(result.map((t) => t.id)).toEqual(['2', '3', '1']);
  });

  it('sorts tasks by created time descending', () => {
    const result = filterAndSortTasks(mockTasks, '', 'all', 'all', 'createdAtDesc');
    expect(result.map((t) => t.id)).toEqual(['2', '3', '1']);
  });
});
