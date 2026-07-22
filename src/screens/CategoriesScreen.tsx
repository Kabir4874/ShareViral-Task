import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ColorPicker from 'react-native-wheel-color-picker';

import { useTasks } from '@/context/TaskContext';
import { Category } from '@/types/task';

const DEFAULT_COLOR = '#4f46e5';

export const CategoriesScreen = () => {
  const insets = useSafeAreaInsets();
  const { categories, tasks, addCategory, deleteCategory, updateCategory } = useTasks();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSelectedColor(DEFAULT_COLOR);
    setModalVisible(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSelectedColor(cat.color || DEFAULT_COLOR);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, name.trim(), selectedColor);
    } else {
      addCategory(name.trim(), selectedColor);
    }

    setModalVisible(false);
  };

  const handleDelete = (category: Category) => {
    const taskCount = tasks.filter((t) => t.categoryId === category.id).length;
    const message =
      taskCount > 0
        ? `This category contains ${taskCount} tasks. Deleting it will keep the tasks unassigned. Proceed?`
        : 'Are you sure you want to delete this category?';

    Alert.alert('Delete Category', message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCategory(category.id),
      },
    ]);
  };

  const topPadding = Math.max(insets.top, 24) + 8;

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Header Container */}
      <BlurView intensity={90} tint="light" className="border-b border-slate-200/60">
        <View className="px-5 pb-3.5" style={{ paddingTop: topPadding }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-2xl font-extrabold tracking-tight text-slate-900">
                Categories
              </Text>
              <Text className="mt-0.5 text-base font-semibold text-slate-400">
                {categories.length} {categories.length === 1 ? 'category' : 'categories'}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openAddModal}
              className="flex-row items-center rounded-full border border-slate-200 bg-slate-100 px-3.5 py-2">
              <Ionicons name="add" size={18} color="#4f46e5" style={{ marginRight: 2 }} />
              <Text className="text-base font-bold text-indigo-600" numberOfLines={1}>
                Category
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      {/* Category List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        renderItem={({ item }) => {
          const taskCount = tasks.filter((t) => t.categoryId === item.id).length;

          return (
            <View className="shadow-xs mb-3.5 flex-row items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
              <View className="flex-1 flex-row items-center pr-3">
                <View
                  className="mr-3.5 h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${item.color}15` }}>
                  <View
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-bold tracking-tight text-slate-900">
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-base font-semibold text-slate-400">
                    {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => openEditModal(item)}
                  className="rounded-lg border border-slate-200/60 bg-slate-100 p-2">
                  <Ionicons name="pencil-outline" size={16} color="#475569" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleDelete(item)}
                  className="rounded-lg border border-rose-100 bg-rose-50 p-2">
                  <Ionicons name="trash-outline" size={16} color="#e11d48" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Center Pop-over Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-slate-900/60 px-5">
          {/* Touch Outside Backdrop to Close */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            className="absolute inset-0"
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="z-10 w-full max-w-sm">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
                {/* Modal Title Bar */}
                <View className="flex-row items-center justify-between border-b border-slate-100 pb-3">
                  <Text className="text-xl font-bold text-slate-900">
                    {editingCategory ? 'Edit Category' : 'Create Category'}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={22} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                  {/* Category Name Input */}
                  <View className="mt-4">
                    <Text className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Category Name
                    </Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g. Finance, Fitness, Study"
                      className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-base font-medium text-slate-900"
                      placeholderTextColor="#94a3b8"
                      autoFocus
                    />
                  </View>

                  {/* Color Wheel Picker Container */}
                  <View className="mt-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Choose Color
                      </Text>
                      <View
                        className="shadow-xs h-5 w-5 rounded-full border border-slate-300"
                        style={{ backgroundColor: selectedColor }}
                      />
                    </View>

                    <ColorPicker
                      color={selectedColor}
                      onColorChangeComplete={(color) => setSelectedColor(color)}
                      thumbSize={20}
                      sliderSize={14}
                      noSnap={true}
                      row={false}
                      swatches={false}
                    />
                  </View>

                  {/* Save & Cancel Buttons */}
                  <View className="mt-6 flex-row items-center gap-3">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setModalVisible(false)}
                      className="flex-1 items-center rounded-xl border border-slate-200/60 bg-slate-100 py-3.5">
                      <Text className="text-base font-bold text-slate-700">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={handleSave}
                      className="flex-1 items-center rounded-xl bg-indigo-600 py-3.5 shadow-sm active:bg-indigo-700">
                      <Text className="text-base font-bold text-white">Save</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};
