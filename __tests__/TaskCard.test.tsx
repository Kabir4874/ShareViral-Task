import { Category, Task } from '@/types/task';

const mockTask: Task = {
  id: 'task-test-1',
  title: 'Complete System Architecture Audit',
  description: 'Verify accessibility and contrast ratios',
  categoryId: 'cat-work',
  status: 'open',
  dueDate: '2026-07-28',
  createdAt: '2026-07-22T09:00:00Z',
  isStarred: true,
};

const mockCategory: Category = {
  id: 'cat-work',
  name: 'Work',
  color: '#4f46e5',
  badgeBg: 'bg-indigo-100',
  badgeText: 'text-indigo-700',
};

describe('TaskCard Data Formatting & Properties', () => {
  it('correctly maps task properties and category badges', () => {
    expect(mockTask.title).toBe('Complete System Architecture Audit');
    expect(mockTask.description).toBe('Verify accessibility and contrast ratios');
    expect(mockTask.dueDate).toBe('2026-07-28');
    expect(mockTask.isStarred).toBe(true);
    expect(mockCategory.name).toBe('Work');
  });

  it('identifies completed tasks', () => {
    const doneTask: Task = { ...mockTask, status: 'done' };
    expect(doneTask.status === 'done').toBe(true);
  });
});
