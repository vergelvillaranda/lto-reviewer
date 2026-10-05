/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Colors, type AppColorScheme, type AppTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemePreferenceStore } from '@/stores/theme-preference-store';

export function useAppColorScheme(): AppColorScheme {
  const systemScheme = useColorScheme();
  const preference = useThemePreferenceStore((state) => state.preference);

  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return systemScheme === 'dark' ? 'dark' : 'light';
}

export function useTheme(): AppTheme {
  const scheme = useAppColorScheme();

  return Colors[scheme];
}

export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: AppTheme) => T,
) {
  return function useThemedStyles(): T {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
