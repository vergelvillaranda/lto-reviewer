import { create } from 'zustand';

import {
  clearBookmarkedQuestionIds,
  getBookmarkedQuestionIds,
  setQuestionBookmark,
} from '@/services/bookmark-storage';

interface BookmarkState {
  questionIds: string[];
  isLoading: boolean;
  hasLoaded: boolean;
  errorMessage: string | null;
  loadBookmarks: () => Promise<void>;
  setBookmarked: (questionId: string, isBookmarked: boolean) => Promise<boolean>;
  clearBookmarks: () => Promise<boolean>;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
  questionIds: [],
  isLoading: false,
  hasLoaded: false,
  errorMessage: null,

  loadBookmarks: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const questionIds = await getBookmarkedQuestionIds();
      set({ questionIds, isLoading: false, hasLoaded: true });
    } catch (error: unknown) {
      console.warn('Unable to load bookmarked questions.', error);
      set({
        isLoading: false,
        hasLoaded: true,
        errorMessage: 'Bookmarks could not be loaded from this device.',
      });
    }
  },

  setBookmarked: async (questionId, isBookmarked) => {
    try {
      const questionIds = await setQuestionBookmark(questionId, isBookmarked);
      set({ questionIds, hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to update bookmarked questions.', error);
      set({ errorMessage: 'This bookmark could not be saved on this device.' });
      return false;
    }
  },

  clearBookmarks: async () => {
    try {
      await clearBookmarkedQuestionIds();
      set({ questionIds: [], hasLoaded: true, errorMessage: null });
      return true;
    } catch (error: unknown) {
      console.warn('Unable to clear bookmarked questions.', error);
      set({ errorMessage: 'Bookmarks could not be cleared from this device.' });
      return false;
    }
  },
}));
