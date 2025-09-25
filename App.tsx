import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Home } from './pages/Home';
import { RecentlyDeleted } from './pages/RecentlyDeleted';
import SplashScreen from './components/SplashScreen';
import { TodoProvider } from './contexts/TodoContext';

let GestureHandlerRootView: any;
if (Platform.OS !== 'web') {
  try {
    const { GestureHandlerRootView: GHRootView } = require('react-native-gesture-handler');
    GestureHandlerRootView = GHRootView;
  } catch (e) {
    GestureHandlerRootView = ({ children, style }: any) => children;
  }
} else {
  GestureHandlerRootView = ({ children, style }: any) => children;
}

type Screen = 'home' | 'recently-deleted';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  const handleNavigateToRecentlyDeleted = () => {
    setCurrentScreen('recently-deleted');
  };

  const handleNavigateToHome = () => {
    setCurrentScreen('home');
  };

  if (isLoading) {
    return (
      <>
        <SplashScreen onFinish={handleSplashFinish} />
        <StatusBar style="light" />
      </>
    );
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigateToRecentlyDeleted={handleNavigateToRecentlyDeleted} />;
      case 'recently-deleted':
        return <RecentlyDeleted onNavigateBack={handleNavigateToHome} />;
      default:
        return <Home onNavigateToRecentlyDeleted={handleNavigateToRecentlyDeleted} />;
    }
  };

  return (
    <TodoProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {renderCurrentScreen()}
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </TodoProvider>
  );
}
