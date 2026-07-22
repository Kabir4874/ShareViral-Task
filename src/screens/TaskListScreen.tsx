import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TaskCard } from '@/components/TaskCard';
import { useTasks } from '@/context/TaskContext';
import { RootStackParamList } from '@/types/navigation';
import { FilterStatus, SortOption } from '@/types/task';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TaskListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    tasks,
    categories,
    selectedCategory,
    statusFilter,
    sortOption,
    searchQuery,
    setSelectedCategory,
    setStatusFilter,
    setSortOption,
    setSearchQuery,
  } = useTasks();

  const [sortModalVisible, setSortModalVisible] = useState(false);

  const handleCloseSortModal = () => {
    setSortModalVisible(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || task.categoryId === selectedCategory;

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
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

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const topPadding = Math.max(insets.top, 24) + 8;

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Minimal Ultra-Clean Header */}
      <BlurView intensity={90} tint="light" className="border-b border-slate-200/60">
        <View className="px-5 pb-3" style={{ paddingTop: topPadding }}>
          {/* Top Title & Single Sort Button */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-extrabold tracking-tight text-slate-900">Tasks</Text>
              <Text className="mt-0.5 text-base font-semibold text-slate-400">
                {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
              </Text>
            </View>

            {/* Header Right Action: Minimal Sort Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSortModalVisible(true)}
              className="flex-row items-center rounded-full border border-slate-200 bg-slate-100 px-3.5 py-2">
              <Ionicons
                name="options-outline"
                size={16}
                color="#475569"
                style={{ marginRight: 4 }}
              />
              <Text className="text-base font-bold text-slate-700">Sort</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar - Pixel-Perfect Middle Aligned Input & Icon */}
          <View className="mt-3 flex-row items-center rounded-2xl border border-slate-200/80 bg-slate-100/90 px-3.5 py-2.5">
            <View className="mr-2 justify-center">
              <Ionicons name="search-outline" size={18} color="#64748b" />
            </View>
            <TextInput
              placeholder="Search tasks..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="m-0 flex-1 p-0 text-base font-medium text-slate-900"
              placeholderTextColor="#94a3b8"
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="ml-2 justify-center">
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Status Tabs Segmented Control */}
          <View className="mt-2.5 flex-row rounded-2xl border border-slate-200/60 bg-slate-100/90 p-1">
            {(['all', 'open', 'done'] as FilterStatus[]).map((st) => {
              const isActive = statusFilter === st;
              const label = st.charAt(0).toUpperCase() + st.slice(1);
              return (
                <TouchableOpacity
                  key={st}
                  activeOpacity={0.8}
                  onPress={() => setStatusFilter(st)}
                  className={`flex-1 items-center rounded-xl py-1.5 ${
                    isActive ? 'shadow-xs bg-white' : ''
                  }`}>
                  <Text
                    className={`text-sm font-bold ${
                      isActive ? 'text-indigo-600' : 'text-slate-500'
                    }`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Category Horizontal Scroll Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2.5 flex-row"
            contentContainerStyle={{ paddingRight: 10 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedCategory('all')}
              className={`mr-2 rounded-full border px-3.5 py-1 ${
                selectedCategory === 'all'
                  ? 'border-slate-900 bg-slate-900'
                  : 'border-slate-200 bg-white'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  selectedCategory === 'all' ? 'text-white' : 'text-slate-600'
                }`}>
                All Categories
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(cat.id)}
                  className={`mr-2 flex-row items-center rounded-full border px-3.5 py-1 ${
                    isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-white'
                  }`}>
                  <View
                    className="mr-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#ffffff' : cat.color }}
                  />
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : 'text-slate-700'
                    }`}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </BlurView>

      {/* Task List */}
      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            category={getCategory(item.categoryId)}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="clipboard-outline" size={56} color="#cbd5e1" />
            <Text className="mt-3 text-lg font-bold text-slate-700">No tasks found</Text>
            <Text className="mt-1 text-base text-slate-400">
              Try adjusting your search or filters to view your tasks.
            </Text>
          </View>
        }
      />

      {/* Floating Action Button (FAB) for New Task */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('EditTask', {})}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/40">
        <Ionicons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>

      {/* Sort Options Modal */}
      <Modal
        visible={sortModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseSortModal}>
        <View className="flex-1 justify-end bg-transparent">
          {/* Touch Outside Backdrop */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleCloseSortModal}
            className="absolute inset-0 bg-transparent"
          />

          <View className="z-10 rounded-t-3xl border-t border-slate-200/80 bg-white p-6 shadow-2xl">
            <View className="flex-row items-center justify-between border-b border-slate-100 pb-3">
              <Text className="text-xl font-bold text-slate-900">Sort Tasks</Text>
              <TouchableOpacity onPress={handleCloseSortModal}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="mt-3 gap-2">
              {[
                { id: 'dueDateAsc', label: 'Due Date (Earliest First)' },
                { id: 'dueDateDesc', label: 'Due Date (Latest First)' },
                { id: 'createdAtDesc', label: 'Created Time (Newest First)' },
                { id: 'createdAtAsc', label: 'Created Time (Oldest First)' },
              ].map((opt) => {
                const isSelected = sortOption === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSortOption(opt.id as SortOption);
                      handleCloseSortModal();
                    }}
                    className={`flex-row items-center justify-between rounded-2xl border p-4 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80'
                        : 'border-slate-100 bg-slate-50'
                    }`}>
                    <Text
                      className={`text-base font-semibold ${
                        isSelected ? 'text-indigo-600' : 'text-slate-700'
                      }`}>
                      {opt.label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#4f46e5" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
