import { supabase } from '../lib/supabase';
import { Category, Task } from '../types/task';

export const supabaseService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      if (error?.message?.includes('schema cache')) {
        console.info(
          'Supabase schema notice: Tables not initialized yet in remote database. Using local data.'
        );
      } else {
        console.warn('Supabase fetch categories notice:', error?.message);
      }
      return [];
    }
    return data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      badgeBg: cat.badge_bg || 'bg-indigo-100',
      badgeText: cat.badge_text || 'text-indigo-700',
    }));
  },

  async addCategory(category: Category): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          id: category.id,
          name: category.name,
          color: category.color,
          badge_bg: category.badgeBg,
          badge_text: category.badgeText,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.info('Supabase add category notice:', error?.message);
      return null;
    }
    return category;
  },

  async updateCategory(id: string, name: string, color: string): Promise<boolean> {
    const { error } = await supabase.from('categories').update({ name, color }).eq('id', id);

    if (error) {
      console.info('Supabase update category notice:', error?.message);
      return false;
    }
    return true;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      console.info('Supabase delete category notice:', error?.message);
      return false;
    }
    return true;
  },

  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      if (error?.message?.includes('schema cache')) {
        console.info(
          'Supabase schema notice: Tasks table not initialized yet in remote database. Using local data.'
        );
      } else {
        console.warn('Supabase fetch tasks notice:', error?.message);
      }
      return [];
    }
    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      categoryId: task.category_id,
      status: task.status as 'open' | 'done',
      dueDate: task.due_date,
      createdAt: task.created_at,
      isStarred: Boolean(task.is_starred),
    }));
  },

  async addTask(task: Task): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          id: task.id,
          title: task.title,
          description: task.description,
          category_id: task.categoryId,
          status: task.status,
          due_date: task.dueDate,
          is_starred: task.isStarred,
          created_at: task.createdAt,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.warn('Supabase add task notice:', error?.message);
      return null;
    }
    return task;
  },

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<boolean> {
    const payload: Record<string, any> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.categoryId !== undefined) payload.category_id = updates.categoryId;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
    if (updates.isStarred !== undefined) payload.is_starred = updates.isStarred;

    const { error } = await supabase.from('tasks').update(payload).eq('id', id);
    if (error) {
      console.warn('Supabase update task notice:', error?.message);
      return false;
    }
    return true;
  },

  async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete task notice:', error?.message);
      return false;
    }
    return true;
  },
};
