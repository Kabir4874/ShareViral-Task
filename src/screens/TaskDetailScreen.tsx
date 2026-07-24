import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryBadge } from '@/components/CategoryBadge';
import { useTasks } from '@/context/TaskContext';
import { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const insets = useSafeAreaInsets();
  const { taskId } = route.params;

  const { tasks, categories, toggleTaskStatus, toggleTaskStar, deleteTask } = useTasks();

  const task = tasks.find((t) => t.id === taskId);
  const category = categories.find((c) => c?.id === task?.categoryId);

  const topPadding = Math.max(insets.top, 24) + 8;

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8fafc] p-5">
        <Ionicons name="clipboard-outline" size={56} color="#cbd5e1" />
        <Text className="mt-3 text-lg font-bold text-slate-700">Task not found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="shadow-xs mt-4 rounded-full bg-indigo-600 px-6 py-2.5">
          <Text className="text-sm font-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isDone = task.status === 'done';

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Header Container - Clean Back Arrow on Left, Centered Title, Star on Right */}
      <BlurView intensity={90} tint="light" className="border-b border-slate-200/60">
        <View className="px-5 pb-3.5" style={{ paddingTop: topPadding }}>
          <View className="flex-row items-center justify-between">
            {/* Left: Clean Arrow Icon Back Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              className="h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
              <Ionicons name="chevron-back" size={20} color="#475569" />
            </TouchableOpacity>

            {/* Middle: Title */}
            <Text className="text-xl font-extrabold tracking-tight text-slate-900">
              Task Details
            </Text>

            {/* Right: Spacer to keep title centered */}
            <View className="h-10 w-10" />
          </View>
        </View>
      </BlurView>

      {/* Detail Content List */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        {/* Main Title & Status Card */}
        <View className="shadow-xs mb-3.5 rounded-2xl border border-slate-100 bg-white p-4">
          <View className="flex-row items-center justify-between">
            <CategoryBadge category={category} />

            <View
              className={`rounded-full px-3 py-1 ${
                isDone ? 'bg-slate-100' : 'border border-indigo-100 bg-indigo-50'
              }`}>
              <Text
                className={`text-sm font-bold ${isDone ? 'text-slate-500' : 'text-indigo-600'}`}>
                {isDone ? 'DONE' : 'OPEN'}
              </Text>
            </View>
          </View>

          <Text
            className={`mt-4 text-2xl font-bold tracking-tight ${
              isDone ? 'text-slate-400 line-through' : 'text-slate-900'
            }`}>
            {task.title}
          </Text>

          {/* Local Star Flag Toggle Banner */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleTaskStar(task.id)}
            className={`mt-4 flex-row items-center justify-between rounded-xl border p-3.5 ${
              task.isStarred ? 'border-amber-200 bg-amber-50/80' : 'border-slate-200/60 bg-slate-50'
            }`}>
            <View className="flex-row items-center">
              <Ionicons
                name={task.isStarred ? 'star' : 'star-outline'}
                size={18}
                color={task.isStarred ? '#f59e0b' : '#94a3b8'}
                style={{ marginRight: 8 }}
              />
              <Text
                className={`text-base font-semibold ${
                  task.isStarred ? 'text-amber-800' : 'text-slate-600'
                }`}>
                {task.isStarred ? 'Starred Task' : 'Tap to Star this task'}
              </Text>
            </View>
            <Ionicons
              name={task.isStarred ? 'checkmark-circle' : 'chevron-forward'}
              size={16}
              color={task.isStarred ? '#f59e0b' : '#cbd5e1'}
            />
          </TouchableOpacity>
        </View>

        {/* Task Properties Info Card */}
        <View className="shadow-xs mb-3.5 rounded-2xl border border-slate-100 bg-white p-4">
          <Text className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Task Information
          </Text>

          <View className="mt-3 flex-row items-center justify-between border-b border-slate-100 pb-3">
            <View className="flex-row items-center">
              <Ionicons
                name="calendar-outline"
                size={16}
                color="#64748b"
                style={{ marginRight: 6 }}
              />
              <Text className="text-base font-medium text-slate-500">Due Date</Text>
            </View>
            <Text className="text-base font-bold text-slate-900">{task.dueDate}</Text>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#64748b" style={{ marginRight: 6 }} />
              <Text className="text-base font-medium text-slate-500">Created At</Text>
            </View>
            <Text className="text-base font-semibold text-slate-600">
              {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Task Description */}
        <View className="shadow-xs mb-3.5 rounded-2xl border border-slate-100 bg-white p-4">
          <Text className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Description
          </Text>
          <Text className="mt-2.5 text-base font-normal leading-6 text-slate-600">
            {task.description || 'No description provided.'}
          </Text>
        </View>
      </ScrollView>

      {/* Footer Bottom Actions Bar */}
      <SafeAreaView
        edges={['bottom']}
        className="border-t border-slate-200/60 bg-white/95 px-5 py-3 shadow-lg">
        <View className="flex-row items-center gap-3">
          {/* Complete / Reopen Primary Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => toggleTaskStatus(task.id)}
            className={`shadow-xs flex-1 flex-row items-center justify-center rounded-xl py-3.5 ${
              isDone ? 'bg-slate-900' : 'bg-indigo-600'
            }`}>
            <Ionicons
              name={isDone ? 'refresh-outline' : 'checkmark-done-outline'}
              size={18}
              color="#ffffff"
              style={{ marginRight: 6 }}
            />
            <Text className="text-base font-bold text-white">
              {isDone ? 'Reopen Task' : 'Complete Task'}
            </Text>
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
            className="flex-row items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-3.5">
            <Ionicons name="create-outline" size={18} color="#475569" style={{ marginRight: 4 }} />
            <Text className="text-base font-bold text-slate-700">Edit</Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDelete}
            className="items-center justify-center rounded-xl border border-rose-100 bg-rose-50 px-4 py-3.5">
            <Ionicons name="trash-outline" size={18} color="#e11d48" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
