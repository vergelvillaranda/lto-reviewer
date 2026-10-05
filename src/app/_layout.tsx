import { BricolageGrotesque_400Regular } from '@expo-google-fonts/bricolage-grotesque/400Regular';
import { BricolageGrotesque_500Medium } from '@expo-google-fonts/bricolage-grotesque/500Medium';
import { BricolageGrotesque_600SemiBold } from '@expo-google-fonts/bricolage-grotesque/600SemiBold';
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque/700Bold';
import { BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque/800ExtraBold';
import { useFonts } from '@expo-google-fonts/bricolage-grotesque/useFonts';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useAppColorScheme, useTheme } from '@/hooks/use-theme';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { useHapticPreferenceStore } from '@/stores/haptic-preference-store';
import { useThemePreferenceStore } from '@/stores/theme-preference-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });
  const colorScheme = useAppColorScheme();
  const theme = useTheme();
  const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks);
  const loadHapticPreference = useHapticPreferenceStore((state) => state.loadPreference);
  const loadThemePreference = useThemePreferenceStore((state) => state.loadPreference);
  const navigationTheme = useMemo(() => {
    const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.backgroundElement,
        text: theme.text,
        border: theme.border,
        notification: theme.error,
      },
    };
  }, [colorScheme, theme]);

  useEffect(() => {
    void Promise.all([loadBookmarks(), loadHapticPreference(), loadThemePreference()]);
  }, [loadBookmarks, loadHapticPreference, loadThemePreference]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <AnimatedSplashOverlay />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: theme.background },
            headerShown: false,
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="quiz-setup" />
          <Stack.Screen name="quiz" options={{ gestureEnabled: false }} />
          <Stack.Screen name="results" options={{ gestureEnabled: false }} />
          <Stack.Screen name="mock-exam" options={{ gestureEnabled: false }} />
          <Stack.Screen name="exam-results" options={{ gestureEnabled: false }} />
          <Stack.Screen name="exam-review" options={{ gestureEnabled: false }} />
          <Stack.Screen name="history" />
          <Stack.Screen name="history-detail" />
          <Stack.Screen name="mistake-review" options={{ gestureEnabled: false }} />
          <Stack.Screen name="statistics" />
          <Stack.Screen name="bookmarks" />
          <Stack.Screen name="settings" />
        </Stack>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
