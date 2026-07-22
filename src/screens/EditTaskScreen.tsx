import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTasks } from '@/context/TaskContext';
import { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type EditTaskRouteProp = RouteProp<RootStackParamList, 'EditTask'>;

export const EditTaskScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditTaskRouteProp>();
  const insets = useSafeAreaInsets();
  const taskId = route.params?.taskId;

  const { tasks, categories, addTask, updateTask } = useTasks();

  const existingTask = taskId ? tasks.find((t) => t.id === taskId) : null;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [categoryId, setCategoryId] = useState(existingTask?.categoryId || categories[0]?.id || '');
  const [dueDate, setDueDate] = useState(
    existingTask?.dueDate || new Date().toISOString().split('T')[0]
  );
  const [isStarred, setIsStarred] = useState(existingTask?.isStarred || false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const topPadding = insets.top;

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please provide a task title.');
      return;
    }

    if (existingTask) {
      updateTask(existingTask.id, {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        dueDate,
        isStarred,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        status: 'open',
        dueDate,
        isStarred,
      });
    }

    navigation.goBack();
  };

  const setQuickDate = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const handleDateChange = (_event: unknown, selectedDate: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setDueDate(selectedDate.toISOString().split('T')[0]);
  };

  const parsedDate = (() => {
    const d = new Date(dueDate + 'T00:00:00');
    return isNaN(d.getTime()) ? new Date() : d;
  })();

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Translucent Frosted Glass Header */}
      <BlurView intensity={90} tint="light" className="z-10 border-b border-slate-200/60">
        <View className="px-5 pb-3" style={{ paddingTop: topPadding }}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              className="h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
              <Ionicons name="close" size={20} color="#475569" />
            </TouchableOpacity>

            <Text className="text-xl font-extrabold tracking-tight text-slate-900">
              {existingTask ? 'Edit Task' : 'New Task'}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSave}
              className="shadow-xs flex-row items-center rounded-full bg-indigo-600 px-4 py-2">
              <Text className="text-base font-bold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      {/* Keyboard Avoiding Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
            {/* Title Input Card */}
            <View className="shadow-xs mb-3.5 rounded-2xl border border-slate-100 bg-white p-5">
              <Text className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Task Title *
              </Text>
              <View className="mt-2 flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="What needs to be done?"
                  className="m-0 flex-1 p-0 text-lg font-bold text-slate-900"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Description Input Card */}
            <View className="shadow-xs mb-3.5 rounded-2xl border border-slate-100 bg-white p-5">
              <Text className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Description (Optional)
              </Text>
              <View className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add details or context..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="m-0 min-h-[80px] p-0 text-base font-medium text-slate-700"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Category Selector Card */}
            <View className="shadow-xs mb-3.5 rounded-2xl border border-slate-100 bg-white p-5">
              <Text className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Category
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.8}
                      onPress={() => setCategoryId(cat.id)}
                      className={`flex-row items-center rounded-full border px-3.5 py-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-200 bg-slate-50'
                      }`}>
                      <View
                        className="mr-1.5 h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: isSelected ? '#ffffff' : cat.color }}
                      />
                      <Text
                        className={`text-sm font-bold ${
                          isSelected ? 'text-white' : 'text-slate-700'
                        }`}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Due Date Card */}
            <View className="shadow-xs mb-3.5 rounded-2xl border border-slate-100 bg-white p-5">
              <Text className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Due Date
              </Text>

              {/* Tappable Date Display */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(!showDatePicker)}
                className="mt-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
                <View className="flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#4f46e5"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-base font-bold text-slate-900">{dueDate}</Text>
                </View>
                <Ionicons
                  name={showDatePicker ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#94a3b8"
                />
              </TouchableOpacity>

              {/* Native Date Picker */}
              {showDatePicker && (
                <View className="mt-2 overflow-hidden rounded-xl">
                  <DateTimePicker
                    value={parsedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onValueChange={handleDateChange}
                    minimumDate={new Date()}
                    accentColor="#4f46e5"
                  />
                </View>
              )}

              {/* Quick Date Shortcuts */}
              <View className="mt-3 flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={() => setQuickDate(0)}
                  className="rounded-lg border border-slate-200/60 bg-slate-100 px-3 py-1.5">
                  <Text className="text-base font-semibold text-slate-700">Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setQuickDate(1)}
                  className="rounded-lg border border-slate-200/60 bg-slate-100 px-3 py-1.5">
                  <Text className="text-base font-semibold text-slate-700">Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setQuickDate(7)}
                  className="rounded-lg border border-slate-200/60 bg-slate-100 px-3 py-1.5">
                  <Text className="text-base font-semibold text-slate-700">Next Week</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Star Flag Toggle */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsStarred(!isStarred)}
              className={`shadow-xs mb-3.5 flex-row items-center justify-between rounded-2xl border p-4 ${
                isStarred ? 'border-amber-200 bg-amber-50/80' : 'border-slate-100 bg-white'
              }`}>
              <View className="flex-row items-center">
                <Ionicons
                  name={isStarred ? 'star' : 'star-outline'}
                  size={22}
                  color={isStarred ? '#f59e0b' : '#94a3b8'}
                  style={{ marginRight: 8 }}
                />
                <Text className="text-base font-bold text-slate-900">Starred Task</Text>
              </View>
              <Text
                className={`text-base font-bold ${isStarred ? 'text-amber-600' : 'text-slate-400'}`}>
                {isStarred ? 'Starred' : 'Not Starred'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};
