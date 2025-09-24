import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Home } from './pages/Home';

// Conditionally import GestureHandlerRootView only for native platforms
let GestureHandlerRootView: any;
if (Platform.OS !== 'web') {
  try {
    const { GestureHandlerRootView: GHRootView } = require('react-native-gesture-handler');
    GestureHandlerRootView = GHRootView;
  } catch (e) {
    // Fallback if gesture handler is not available
    GestureHandlerRootView = ({ children, style }: any) => children;
  }
} else {
  // For web, just use a simple wrapper
  GestureHandlerRootView = ({ children, style }: any) => children;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Home />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
