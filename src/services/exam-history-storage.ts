import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ExamHistoryRecord } from '@/types/exam-history';
import type { MockExamAnswer } from '@/types/mock-exam';
import type { AnswerIndex } from '@/types/quiz';
import { createSerializedOperationQueue } from '@/utils/serialized-operation-queue';
import {
  isNonNegativeInteger,
  isNonNegativeNumber,
  isRecord,
} from '@/utils/type-guards';

const EXAM_HISTORY_STORAGE_KEY = '@lto-reviewer/exam-history/v1';

const storageOperations = createSerializedOperationQueue();

function isAnswerIndex(value: unknown): value is AnswerIndex {
  return Number.isInteger(value) && typeof value === 'number' && value >= 0 && value <= 3;
}

function isMockExamAnswer(value: unknown): value is MockExamAnswer {
  if (
    !isRecord(value) ||
    typeof value.questionId !== 'string' ||
    value.questionId.length === 0
  ) {
    return false;
  }
  const hasStableAnswerIdKey = Object.prototype.hasOwnProperty.call(
    value,
    'selectedAnswerId',
  );
  const hasLegacyAnswerIndexKey = Object.prototype.hasOwnProperty.call(
    value,
    'selectedAnswerIndex',
  );
  if (hasStableAnswerIdKey === hasLegacyAnswerIndexKey) {
    return false;
  }
  return hasStableAnswerIdKey
    ? typeof value.selectedAnswerId === 'string' && value.selectedAnswerId.length > 0
    : isAnswerIndex(value.selectedAnswerIndex);
}

function hasValidStableAnswerId(answer: MockExamAnswer): boolean {
  const { selectedAnswerId } = answer;
  if (typeof selectedAnswerId !== 'string') {
    return true;
  }

  const expectedPrefix = `${answer.questionId}:answer:`;
  if (!selectedAnswerId.startsWith(expectedPrefix)) {
    return false;
  }
  const sourceChoiceNumber = Number(selectedAnswerId.slice(expectedPrefix.length));
  return Number.isInteger(sourceChoiceNumber) && sourceChoiceNumber >= 1 && sourceChoiceNumber <= 4;
}

function calculatePercentage(correct: number, totalQuestions: number): number {
  return Math.round((correct / totalQuestions) * 1000) / 10;
}

function isExamHistoryRecord(value: unknown): value is ExamHistoryRecord {
  if (!isRecord(value)) {
    return false;
  }

  const { correct, incorrect, percentage, score, totalQuestions, unanswered } = value;
  if (
    !isNonNegativeInteger(score) ||
    !isNonNegativeInteger(totalQuestions) ||
    totalQuestions === 0 ||
    !isNonNegativeInteger(correct) ||
    !isNonNegativeInteger(incorrect) ||
    !isNonNegativeInteger(unanswered) ||
    score !== correct ||
    correct + incorrect + unanswered !== totalQuestions ||
    !isNonNegativeNumber(percentage) ||
    percentage > 100 ||
    percentage !== calculatePercentage(correct, totalQuestions)
  ) {
    return false;
  }

  if (
    !Array.isArray(value.questionIds) ||
    !value.questionIds.every(
      (questionId): questionId is string =>
        typeof questionId === 'string' && questionId.length > 0,
    ) ||
    value.questionIds.length !== value.totalQuestions ||
    new Set(value.questionIds).size !== value.questionIds.length
  ) {
    return false;
  }
  const questionIds = value.questionIds;

  if (!Array.isArray(value.answers) || !value.answers.every(isMockExamAnswer)) {
    return false;
  }
  const answers = value.answers;
  const hasValidAnswers =
    answers.length === correct + incorrect &&
    new Set(answers.map((answer) => answer.questionId)).size === answers.length &&
    answers.every(
      (answer) =>
        questionIds.includes(answer.questionId) && hasValidStableAnswerId(answer),
    );

  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.completedAt === 'string' &&
    Number.isFinite(Date.parse(value.completedAt)) &&
    hasValidAnswers
  );
}

export function parseExamHistory(value: unknown): ExamHistoryRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniqueRecords = new Map<string, ExamHistoryRecord>();
  value.forEach((record) => {
    if (isExamHistoryRecord(record) && !uniqueRecords.has(record.id)) {
      uniqueRecords.set(record.id, record);
    }
  });

  return [...uniqueRecords.values()].sort(
    (first, second) => Date.parse(second.completedAt) - Date.parse(first.completedAt),
  );
}

function parseStoredHistory(rawHistory: string | null): ExamHistoryRecord[] {
  if (!rawHistory) {
    return [];
  }

  try {
    return parseExamHistory(JSON.parse(rawHistory) as unknown);
  } catch {
    return [];
  }
}

export async function getExamHistory(): Promise<ExamHistoryRecord[]> {
  await storageOperations.waitForIdle();
  const storedHistory = await AsyncStorage.getItem(EXAM_HISTORY_STORAGE_KEY);
  return parseStoredHistory(storedHistory);
}

export function saveExamHistoryRecord(
  record: ExamHistoryRecord,
): Promise<ExamHistoryRecord[]> {
  return storageOperations.enqueue(async () => {
    const storedHistory = await AsyncStorage.getItem(EXAM_HISTORY_STORAGE_KEY);
    const history = parseStoredHistory(storedHistory);

    if (history.some((existingRecord) => existingRecord.id === record.id)) {
      return history;
    }

    const updatedHistory = parseExamHistory([record, ...history]);
    await AsyncStorage.setItem(EXAM_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  });
}

export function clearExamHistory(): Promise<void> {
  return storageOperations.enqueue(() =>
    AsyncStorage.removeItem(EXAM_HISTORY_STORAGE_KEY),
  );
}
