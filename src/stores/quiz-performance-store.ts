import { create } from 'zustand';

import {
  clearQuizPerformanceAttempts,
  getQuizPerformanceAttempts,
  saveQuizPerformanceAttempt,
} from '@/services/quiz-performance-storage';
import type { QuizPerformanceAttempt } from '@/types/performance';

interface QuizPerformanceState {
  attempts: QuizPerformanceAttempt[];
  isLoading: boolean;
  hasLoaded: boolean;
  errorMessage: string | null;
  loadAttempts: () => Promise<void>;
  saveAttempt: (attempt: QuizPerformanceAttempt) => Promise<boolean>;
  clearAttempts: () => Promise<boolean>;
}

export const useQuizPerformanceStore = create<QuizPerformanceState>((set) => ({
  attempts: [],
  isLoading: false,
  hasLoaded: false,
  errorMessage: null,

  loadAttempts: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const attempts = await getQuizPerformanceAttempts();
      set({ attempts, isLoading: false, hasLoaded: true });
    } catch (error: unknown) {
      console.warn('Unable to load quiz performance data.', error);
      set({
        isLoading: false,
        hasLoaded: true,
        errorMessage: 'Quiz performance could not be loaded from this device.',
      });
    }
  },

  saveAttempt: async (attempt) => {
    try {
      const attempts = await saveQuizPerformanceAttempt(attempt);
      set({ attempts, hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to save quiz performance data.', error);
      set({ errorMessage: 'This quiz could not be added to performance statistics.' });
      return false;
    }
  },

  clearAttempts: async () => {
    try {
      await clearQuizPerformanceAttempts();
      set({ attempts: [], hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to clear quiz performance data.', error);
      set({ errorMessage: 'Quiz performance data could not be cleared from this device.' });
      return false;
    }
  },
}));
