import { create } from 'zustand';

import {
  clearMistakeRecords,
  getMistakeRecords,
  saveMistakeOutcomes,
} from '@/services/mistake-tracking-storage';
import type { MistakeOutcome, MistakeRecord } from '@/types/mistake-tracking';

interface MistakeTrackingState {
  records: MistakeRecord[];
  isLoading: boolean;
  hasLoaded: boolean;
  errorMessage: string | null;
  loadRecords: () => Promise<void>;
  recordOutcome: (outcome: MistakeOutcome) => Promise<boolean>;
  recordOutcomes: (outcomes: readonly MistakeOutcome[]) => Promise<boolean>;
  clearRecords: () => Promise<boolean>;
}

async function persistOutcomes(
  outcomes: readonly MistakeOutcome[],
  set: (state: Partial<MistakeTrackingState>) => void,
): Promise<boolean> {
  if (outcomes.length === 0) {
    return true;
  }

  try {
    const records = await saveMistakeOutcomes(outcomes);
    set({ records, hasLoaded: true, errorMessage: null });
    return true;
  } catch (error: unknown) {
    console.warn('Unable to save mistake tracking data.', error);
    set({ errorMessage: 'Mistake progress could not be saved on this device.' });
    return false;
  }
}

export const useMistakeTrackingStore = create<MistakeTrackingState>((set) => ({
  records: [],
  isLoading: false,
  hasLoaded: false,
  errorMessage: null,

  loadRecords: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const records = await getMistakeRecords();
      set({ records, isLoading: false, hasLoaded: true });
    } catch (error: unknown) {
      console.warn('Unable to load mistake tracking data.', error);
      set({
        isLoading: false,
        hasLoaded: true,
        errorMessage: 'Mistake progress could not be loaded from this device.',
      });
    }
  },

  recordOutcome: (outcome) => persistOutcomes([outcome], set),
  recordOutcomes: (outcomes) => persistOutcomes(outcomes, set),
  clearRecords: async () => {
    try {
      await clearMistakeRecords();
      set({ records: [], hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to clear mistake tracking data.', error);
      set({ errorMessage: 'Mistake history could not be cleared from this device.' });
      return false;
    }
  },
}));
