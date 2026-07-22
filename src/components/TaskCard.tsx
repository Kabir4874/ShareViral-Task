import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { CategoryBadge } from '@/components/CategoryBadge';
import { useTasks } from '@/context/TaskContext';
import { Category, Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onPress: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, category, onPress }) => {
  const { toggleTaskStatus, toggleTaskStar } = useTasks();

  const isDone = task.status === 'done';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`shadow-xs mb-3.5 rounded-2xl border bg-white p-4 ${
        isDone
          ? 'border-slate-200/70 bg-slate-50/80 opacity-60'
          : 'border-slate-100 shadow-slate-100'
      }`}>
      <View className="flex-row items-start justify-between">
        {/* Checkbox & Content */}
        <View className="flex-1 flex-row items-start pr-2">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleTaskStatus(task.id)}
            className="mr-3.5 mt-0.5"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {isDone ? (
              <View className="shadow-xs h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                <Ionicons name="checkmark" size={14} color="#ffffff" />
              </View>
            ) : (
              <View className="h-6 w-6 rounded-full border-2 border-slate-300 bg-white" />
            )}
          </TouchableOpacity>

          <View className="flex-1">
            <Text
              className={`text-lg font-bold tracking-tight ${
                isDone ? 'text-slate-400 line-through' : 'text-slate-900'
              }`}
              numberOfLines={2}>
              {task.title}
            </Text>

            {task.description ? (
              <Text
                className="mt-1 text-base font-normal leading-6 text-slate-600"
                numberOfLines={2}>
                {task.description}
              </Text>
            ) : null}

            {/* Badges Row */}
            <View className="mt-3 flex-row items-center gap-2">
              <CategoryBadge category={category} />

              <View className="flex-row items-center rounded-full bg-slate-100/90 px-2.5 py-1">
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color="#64748b"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-sm font-semibold text-slate-600">{task.dueDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Star Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleTaskStar(task.id)}
          className="p-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons
            name={task.isStarred ? 'star' : 'star-outline'}
            size={22}
            color={task.isStarred ? '#f59e0b' : '#cbd5e1'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
