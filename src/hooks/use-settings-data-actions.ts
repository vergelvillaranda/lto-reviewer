import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { useBookmarkStore } from '@/stores/bookmark-store';
import { useExamHistoryStore } from '@/stores/exam-history-store';
import { useHapticPreferenceStore } from '@/stores/haptic-preference-store';
import { useMistakeTrackingStore } from '@/stores/mistake-tracking-store';
import { useMockExamStore } from '@/stores/mock-exam-store';
import { useQuizPerformanceStore } from '@/stores/quiz-performance-store';
import { useQuizStore } from '@/stores/quiz-store';
import { useThemePreferenceStore } from '@/stores/theme-preference-store';

type DataAction = 'history' | 'mistakes' | 'bookmarks' | 'all';

interface SettingsDataActions {
  confirmClearBookmarks: () => void;
  confirmClearExamHistory: () => void;
  confirmClearMistakes: () => void;
  confirmResetAllData: () => void;
  isBusy: boolean;
}

export function useSettingsDataActions(): SettingsDataActions {
  const clearBookmarks = useBookmarkStore((state) => state.clearBookmarks);
  const clearHistory = useExamHistoryStore((state) => state.clearHistory);
  const clearMistakes = useMistakeTrackingStore((state) => state.clearRecords);
  const clearQuizPerformance = useQuizPerformanceStore((state) => state.clearAttempts);
  const resetHapticPreference = useHapticPreferenceStore((state) => state.resetPreference);
  const resetMockExam = useMockExamStore((state) => state.resetMockExam);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const resetThemePreference = useThemePreferenceStore((state) => state.resetPreference);
  const [busyAction, setBusyAction] = useState<DataAction | null>(null);

  const runDataAction = useCallback(async (
    action: DataAction,
    operation: () => Promise<boolean>,
    successMessage: string,
  ) => {
    setBusyAction(action);
    const succeeded = await operation();
    setBusyAction(null);

    Alert.alert(
      succeeded ? 'Done' : 'Unable to Complete',
      succeeded
        ? successMessage
        : 'The data could not be cleared from this device. Please try again.',
    );
  }, []);

  const confirmDataAction = useCallback((
    action: DataAction,
    title: string,
    message: string,
    operation: () => Promise<boolean>,
    successMessage: string,
  ) => {
    if (busyAction) {
      return;
    }

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: action === 'all' ? 'Reset' : 'Delete',
        style: 'destructive',
        onPress: () => void runDataAction(action, operation, successMessage),
      },
    ]);
  }, [busyAction, runDataAction]);

  const resetAllAppData = useCallback(async (): Promise<boolean> => {
    const results = await Promise.all([
      clearHistory(),
      clearMistakes(),
      clearBookmarks(),
      clearQuizPerformance(),
      resetThemePreference(),
      resetHapticPreference(),
    ]);

    resetQuiz();
    resetMockExam();
    return results.every(Boolean);
  }, [
    clearBookmarks,
    clearHistory,
    clearMistakes,
    clearQuizPerformance,
    resetHapticPreference,
    resetMockExam,
    resetQuiz,
    resetThemePreference,
  ]);

  const confirmClearExamHistory = useCallback(() => {
    confirmDataAction(
      'history',
      'Clear Exam History?',
      'Delete all exam history? This cannot be undone.',
      clearHistory,
      'Exam history has been cleared.',
    );
  }, [clearHistory, confirmDataAction]);

  const confirmClearMistakes = useCallback(() => {
    confirmDataAction(
      'mistakes',
      'Clear Mistake History?',
      'Delete all mistake history? This cannot be undone.',
      clearMistakes,
      'Mistake history has been cleared.',
    );
  }, [clearMistakes, confirmDataAction]);

  const confirmClearBookmarks = useCallback(() => {
    confirmDataAction(
      'bookmarks',
      'Clear Bookmarks?',
      'Delete all bookmarks? This cannot be undone.',
      clearBookmarks,
      'Bookmarks have been cleared.',
    );
  }, [clearBookmarks, confirmDataAction]);

  const confirmResetAllData = useCallback(() => {
    confirmDataAction(
      'all',
      'Reset All App Data?',
      'This deletes exam history, quiz statistics, mistake history, bookmarks, and active sessions. Appearance and haptic settings will return to their defaults. This cannot be undone.',
      resetAllAppData,
      'All app data has been reset.',
    );
  }, [confirmDataAction, resetAllAppData]);

  return {
    confirmClearBookmarks,
    confirmClearExamHistory,
    confirmClearMistakes,
    confirmResetAllData,
    isBusy: busyAction !== null,
  };
}
