import { cacheService } from '@/services/cacheService';
import { Task } from '@/types/task';

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

describe('Local-Starred Merge Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('preserves per-device local isStarred state over backend response', () => {
    const remoteTasks: Task[] = [
      {
        id: 'task-101',
        title: 'Updated Title from Supabase',
        description: 'Server description',
        categoryId: 'cat-work',
        status: 'open',
        dueDate: '2026-08-01',
        createdAt: '2026-07-20T10:00:00Z',
        isStarred: false,
      },
    ];

    const currentLocalTasks: Task[] = [
      {
        id: 'task-101',
        title: 'Old Title',
        description: 'Old description',
        categoryId: 'cat-work',
        status: 'open',
        dueDate: '2026-08-01',
        createdAt: '2026-07-20T10:00:00Z',
        isStarred: true,
      },
    ];

    const merged = mergeRemoteTasksWithLocalStarred(remoteTasks, currentLocalTasks);

    expect(merged[0].title).toBe('Updated Title from Supabase');
    expect(merged[0].isStarred).toBe(true);
  });

  it('preserves MMKV local starred map override when task is fetched fresh', () => {
    cacheService.setTaskStarredLocally('task-202', true);

    const remoteTasks: Task[] = [
      {
        id: 'task-202',
        title: 'New Remote Task',
        description: 'Server data',
        categoryId: 'cat-health',
        status: 'open',
        dueDate: '2026-08-05',
        createdAt: '2026-07-22T10:00:00Z',
        isStarred: false,
      },
    ];

    const merged = mergeRemoteTasksWithLocalStarred(remoteTasks, []);

    expect(merged[0].isStarred).toBe(true);
  });
});
