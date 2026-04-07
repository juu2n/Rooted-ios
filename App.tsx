import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from './src/context/AppDataContext';
import { ProducerInventoryProvider } from './src/context/ProducerInventoryContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AppDataProvider>
      <ProducerInventoryProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </SafeAreaProvider>
      </ProducerInventoryProvider>
    </AppDataProvider>
  );
}
