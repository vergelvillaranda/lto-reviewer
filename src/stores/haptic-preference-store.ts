import { create } from 'zustand';

import {
  clearHapticFeedbackPreference,
  getHapticFeedbackEnabled,
  saveHapticFeedbackEnabled,
} from '@/services/haptic-preference-storage';

interface HapticPreferenceState {
  isEnabled: boolean;
  hasLoaded: boolean;
  errorMessage: string | null;
  loadPreference: () => Promise<void>;
  setEnabled: (isEnabled: boolean) => Promise<boolean>;
  resetPreference: () => Promise<boolean>;
}

export const useHapticPreferenceStore = create<HapticPreferenceState>((set, get) => ({
  isEnabled: true,
  hasLoaded: false,
  errorMessage: null,

  loadPreference: async () => {
    try {
      const isEnabled = await getHapticFeedbackEnabled();
      set({ isEnabled, hasLoaded: true, errorMessage: null });
    } catch (error: unknown) {
      console.warn('Unable to load the haptic feedback preference.', error);
      set({
        isEnabled: true,
        hasLoaded: true,
        errorMessage: 'The haptic feedback preference could not be loaded from this device.',
      });
    }
  },

  setEnabled: async (isEnabled) => {
    const previousValue = get().isEnabled;
    set({ isEnabled, errorMessage: null });
    try {
      await saveHapticFeedbackEnabled(isEnabled);
      set({ errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to save the haptic feedback preference.', error);
      set((state) => ({
        isEnabled: state.isEnabled === isEnabled ? previousValue : state.isEnabled,
        errorMessage: 'The haptic feedback preference could not be saved on this device.',
      }));
      return false;
    }
  },

  resetPreference: async () => {
    try {
      await clearHapticFeedbackPreference();
      set({ isEnabled: true, hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to reset the haptic feedback preference.', error);
      set({ errorMessage: 'The haptic feedback preference could not be reset on this device.' });
      return false;
    }
  },
}));
