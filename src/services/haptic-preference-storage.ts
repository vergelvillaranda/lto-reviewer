import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSerializedOperationQueue } from '@/utils/serialized-operation-queue';

const HAPTIC_PREFERENCE_STORAGE_KEY = '@lto-reviewer/haptic-feedback-enabled/v1';
const ENABLED_VALUE = 'true';
const DISABLED_VALUE = 'false';

const preferenceOperations = createSerializedOperationQueue();

export async function getHapticFeedbackEnabled(): Promise<boolean> {
  await preferenceOperations.waitForIdle();
  const storedPreference = await AsyncStorage.getItem(HAPTIC_PREFERENCE_STORAGE_KEY);
  return storedPreference !== DISABLED_VALUE;
}

export async function saveHapticFeedbackEnabled(isEnabled: boolean): Promise<void> {
  await preferenceOperations.enqueue(() =>
    AsyncStorage.setItem(
      HAPTIC_PREFERENCE_STORAGE_KEY,
      isEnabled ? ENABLED_VALUE : DISABLED_VALUE,
    ),
  );
}

export async function clearHapticFeedbackPreference(): Promise<void> {
  await preferenceOperations.enqueue(() =>
    AsyncStorage.removeItem(HAPTIC_PREFERENCE_STORAGE_KEY),
  );
}
