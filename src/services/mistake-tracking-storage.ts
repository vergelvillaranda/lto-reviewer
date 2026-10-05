import AsyncStorage from '@react-native-async-storage/async-storage';

import type { MistakeOutcome, MistakeRecord } from '@/types/mistake-tracking';
import { createSerializedOperationQueue } from '@/utils/serialized-operation-queue';
import { isNonNegativeInteger, isRecord } from '@/utils/type-guards';

const MISTAKE_TRACKING_STORAGE_KEY = '@lto-reviewer/mistake-tracking/v1';

const storageOperations = createSerializedOperationQueue();

function isMistakeRecord(value: unknown): value is MistakeRecord {
  return (
    isRecord(value) &&
    typeof value.questionId === 'string' &&
    value.questionId.length > 0 &&
    isNonNegativeInteger(value.timesAnsweredIncorrectly) &&
    value.timesAnsweredIncorrectly > 0 &&
    isNonNegativeInteger(value.timesAnsweredCorrectly) &&
    isNonNegativeInteger(value.consecutiveCorrectAnswers) &&
    value.consecutiveCorrectAnswers <= value.timesAnsweredCorrectly &&
    typeof value.lastIncorrectAt === 'string' &&
    Number.isFinite(Date.parse(value.lastIncorrectAt))
  );
}

export function parseMistakeRecords(value: unknown): MistakeRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniqueRecords = new Map<string, MistakeRecord>();
  value.forEach((record) => {
    if (isMistakeRecord(record) && !uniqueRecords.has(record.questionId)) {
      uniqueRecords.set(record.questionId, record);
    }
  });

  return [...uniqueRecords.values()].sort((first, second) =>
    first.questionId.localeCompare(second.questionId),
  );
}

function parseStoredRecords(rawRecords: string | null): MistakeRecord[] {
  if (!rawRecords) {
    return [];
  }

  try {
    return parseMistakeRecords(JSON.parse(rawRecords) as unknown);
  } catch {
    return [];
  }
}

export function applyMistakeOutcomes(
  currentRecords: readonly MistakeRecord[],
  outcomes: readonly MistakeOutcome[],
  recordedAt: string = new Date().toISOString(),
): MistakeRecord[] {
  const recordsByQuestionId = new Map(
    currentRecords.map((record) => [record.questionId, { ...record }]),
  );
  const uniqueOutcomes = new Map(
    outcomes
      .filter((outcome) => outcome.questionId.length > 0)
      .map((outcome) => [outcome.questionId, outcome]),
  );

  uniqueOutcomes.forEach((outcome) => {
    const existingRecord = recordsByQuestionId.get(outcome.questionId);

    if (outcome.isCorrect) {
      if (existingRecord) {
        recordsByQuestionId.set(outcome.questionId, {
          ...existingRecord,
          timesAnsweredCorrectly: existingRecord.timesAnsweredCorrectly + 1,
          consecutiveCorrectAnswers: existingRecord.consecutiveCorrectAnswers + 1,
        });
      }
      return;
    }

    recordsByQuestionId.set(outcome.questionId, {
      questionId: outcome.questionId,
      timesAnsweredIncorrectly: (existingRecord?.timesAnsweredIncorrectly ?? 0) + 1,
      timesAnsweredCorrectly: existingRecord?.timesAnsweredCorrectly ?? 0,
      consecutiveCorrectAnswers: 0,
      lastIncorrectAt: recordedAt,
    });
  });

  return [...recordsByQuestionId.values()].sort((first, second) =>
    first.questionId.localeCompare(second.questionId),
  );
}

export async function getMistakeRecords(): Promise<MistakeRecord[]> {
  await storageOperations.waitForIdle();
  const storedRecords = await AsyncStorage.getItem(MISTAKE_TRACKING_STORAGE_KEY);
  return parseStoredRecords(storedRecords);
}

export function saveMistakeOutcomes(
  outcomes: readonly MistakeOutcome[],
): Promise<MistakeRecord[]> {
  return storageOperations.enqueue(async () => {
    const storedRecords = await AsyncStorage.getItem(MISTAKE_TRACKING_STORAGE_KEY);
    const currentRecords = parseStoredRecords(storedRecords);
    const updatedRecords = applyMistakeOutcomes(currentRecords, outcomes);
    await AsyncStorage.setItem(
      MISTAKE_TRACKING_STORAGE_KEY,
      JSON.stringify(updatedRecords),
    );
    return updatedRecords;
  });
}

export function clearMistakeRecords(): Promise<void> {
  return storageOperations.enqueue(() =>
    AsyncStorage.removeItem(MISTAKE_TRACKING_STORAGE_KEY),
  );
}
