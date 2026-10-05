import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSerializedOperationQueue } from '@/utils/serialized-operation-queue';

const BOOKMARK_STORAGE_KEY = '@lto-reviewer/bookmarked-question-ids/v1';

const storageOperations = createSerializedOperationQueue();

export function parseBookmarkedQuestionIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(
    value.filter(
      (questionId): questionId is string =>
        typeof questionId === 'string' && questionId.length > 0,
    ),
  )];
}

function parseStoredQuestionIds(rawQuestionIds: string | null): string[] {
  if (!rawQuestionIds) {
    return [];
  }

  try {
    return parseBookmarkedQuestionIds(JSON.parse(rawQuestionIds) as unknown);
  } catch {
    return [];
  }
}

export async function getBookmarkedQuestionIds(): Promise<string[]> {
  await storageOperations.waitForIdle();
  const storedQuestionIds = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
  return parseStoredQuestionIds(storedQuestionIds);
}

export function setQuestionBookmark(
  questionId: string,
  isBookmarked: boolean,
): Promise<string[]> {
  return storageOperations.enqueue(async () => {
    const storedQuestionIds = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
    const questionIds = parseStoredQuestionIds(storedQuestionIds);
    const updatedQuestionIds = isBookmarked
      ? parseBookmarkedQuestionIds([...questionIds, questionId])
      : questionIds.filter((storedQuestionId) => storedQuestionId !== questionId);

    await AsyncStorage.setItem(
      BOOKMARK_STORAGE_KEY,
      JSON.stringify(updatedQuestionIds),
    );
    return updatedQuestionIds;
  });
}

export function clearBookmarkedQuestionIds(): Promise<void> {
  return storageOperations.enqueue(() =>
    AsyncStorage.removeItem(BOOKMARK_STORAGE_KEY),
  );
}
