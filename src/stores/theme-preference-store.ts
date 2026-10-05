import { create } from 'zustand';

import {
  clearThemePreference,
  getThemePreference,
  saveThemePreference,
  type ThemePreference,
} from '@/services/theme-preference-storage';

interface ThemePreferenceState {
  preference: ThemePreference;
  hasLoaded: boolean;
  errorMessage: string | null;
  loadPreference: () => Promise<void>;
  setPreference: (preference: ThemePreference) => Promise<boolean>;
  resetPreference: () => Promise<boolean>;
}

export const useThemePreferenceStore = create<ThemePreferenceState>((set, get) => ({
  preference: 'system',
  hasLoaded: false,
  errorMessage: null,

  loadPreference: async () => {
    try {
      const preference = await getThemePreference();
      set({ preference, hasLoaded: true, errorMessage: null });
    } catch (error: unknown) {
      console.warn('Unable to load the theme preference.', error);
      set({
        preference: 'system',
        hasLoaded: true,
        errorMessage: 'Your display preference could not be loaded from this device.',
      });
    }
  },

  setPreference: async (preference) => {
    const previousPreference = get().preference;
    set({ preference, errorMessage: null });
    try {
      await saveThemePreference(preference);
      set({ errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to save the theme preference.', error);
      set((state) => ({
        preference:
          state.preference === preference ? previousPreference : state.preference,
        errorMessage: 'Your display preference could not be saved on this device.',
      }));
      return false;
    }
  },

  resetPreference: async () => {
    try {
      await clearThemePreference();
      set({ preference: 'system', hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to reset the theme preference.', error);
      set({ errorMessage: 'Your display preference could not be reset on this device.' });
      return false;
    }
  },
}));
