import { create } from 'zustand';

import {
  clearExamHistory,
  getExamHistory,
  saveExamHistoryRecord,
} from '@/services/exam-history-storage';
import type { ExamHistoryRecord } from '@/types/exam-history';

interface ExamHistoryState {
  records: ExamHistoryRecord[];
  isLoading: boolean;
  hasLoaded: boolean;
  errorMessage: string | null;
  loadHistory: () => Promise<void>;
  saveRecord: (record: ExamHistoryRecord) => Promise<boolean>;
  clearHistory: () => Promise<boolean>;
}

export const useExamHistoryStore = create<ExamHistoryState>((set) => ({
  records: [],
  isLoading: false,
  hasLoaded: false,
  errorMessage: null,

  loadHistory: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const records = await getExamHistory();
      set({ records, isLoading: false, hasLoaded: true });
    } catch (error: unknown) {
      console.warn('Unable to load exam history.', error);
      set({
        isLoading: false,
        hasLoaded: true,
        errorMessage: 'Exam history could not be loaded from this device.',
      });
    }
  },

  saveRecord: async (record) => {
    try {
      const records = await saveExamHistoryRecord(record);
      set({ records, hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to save exam history.', error);
      set({ errorMessage: 'This exam result could not be saved to history.' });
      return false;
    }
  },

  clearHistory: async () => {
    try {
      await clearExamHistory();
      set({ records: [], hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to clear exam history.', error);
      set({ errorMessage: 'Exam history could not be cleared from this device.' });
      return false;
    }
  },
}));
