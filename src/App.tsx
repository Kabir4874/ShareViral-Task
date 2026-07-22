import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/global.css';
import { TaskProvider } from '@/context/TaskContext';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </TaskProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
