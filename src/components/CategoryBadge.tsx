import React from 'react';
import { Text, View } from 'react-native';

import { Category } from '@/types/task';

interface CategoryBadgeProps {
  category?: Category;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  if (!category) return null;

  return (
    <View className="flex-row items-center rounded-full bg-slate-100 px-2.5 py-1">
      <View
        className="mr-1.5 h-2 w-2 rounded-full"
        style={{ backgroundColor: category.color || '#6366f1' }}
      />
      <Text className="text-sm font-medium text-slate-700">{category.name}</Text>
    </View>
  );
};
