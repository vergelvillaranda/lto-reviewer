import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSerializedOperationQueue } from '@/utils/serialized-operation-queue';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_PREFERENCE_STORAGE_KEY = '@lto-reviewer/theme-preference/v1';

const preferenceOperations = createSerializedOperationQueue();

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export async function getThemePreference(): Promise<ThemePreference> {
  await preferenceOperations.waitForIdle();
  const storedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
  return isThemePreference(storedPreference) ? storedPreference : 'system';
}

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  await preferenceOperations.enqueue(() =>
    AsyncStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference),
  );
}

export async function clearThemePreference(): Promise<void> {
  await preferenceOperations.enqueue(() =>
    AsyncStorage.removeItem(THEME_PREFERENCE_STORAGE_KEY),
  );
}
