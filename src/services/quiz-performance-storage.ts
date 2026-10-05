import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  QuizPerformanceAnswer,
  QuizPerformanceAttempt,
} from '@/types/performance';
import { createSerializedOperationQueue } from '@/utils/serialized-operation-queue';
import {
  isNonNegativeInteger,
  isNonNegativeNumber,
  isRecord,
} from '@/utils/type-guards';

const QUIZ_PERFORMANCE_STORAGE_KEY = '@lto-reviewer/quiz-performance/v1';

const storageOperations = createSerializedOperationQueue();

function isQuizPerformanceAnswer(value: unknown): value is QuizPerformanceAnswer {
  return (
    isRecord(value) &&
    typeof value.questionId === 'string' &&
    value.questionId.length > 0 &&
    typeof value.isCorrect === 'boolean'
  );
}

function isQuizPerformanceAttempt(value: unknown): value is QuizPerformanceAttempt {
  if (!isRecord(value)) {
    return false;
  }

  const { correct, incorrect, percentage, totalQuestions } = value;
  if (
    !isNonNegativeInteger(totalQuestions) ||
    totalQuestions === 0 ||
    !isNonNegativeInteger(correct) ||
    !isNonNegativeInteger(incorrect) ||
    correct + incorrect !== totalQuestions ||
    !isNonNegativeNumber(percentage) ||
    percentage > 100 ||
    percentage !== Math.round((correct / totalQuestions) * 1000) / 10
  ) {
    return false;
  }

  if (!Array.isArray(value.answers) || !value.answers.every(isQuizPerformanceAnswer)) {
    return false;
  }
  const answers = value.answers;
  const hasValidAnswers =
    answers.length === totalQuestions &&
    new Set(answers.map((answer) => answer.questionId)).size === answers.length &&
    answers.filter((answer) => answer.isCorrect).length === correct;

  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.completedAt === 'string' &&
    Number.isFinite(Date.parse(value.completedAt)) &&
    hasValidAnswers
  );
}

export function parseQuizPerformanceAttempts(value: unknown): QuizPerformanceAttempt[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniqueAttempts = new Map<string, QuizPerformanceAttempt>();
  value.forEach((attempt) => {
    if (isQuizPerformanceAttempt(attempt) && !uniqueAttempts.has(attempt.id)) {
      uniqueAttempts.set(attempt.id, attempt);
    }
  });

  return [...uniqueAttempts.values()].sort(
    (first, second) => Date.parse(second.completedAt) - Date.parse(first.completedAt),
  );
}

function parseStoredAttempts(rawAttempts: string | null): QuizPerformanceAttempt[] {
  if (!rawAttempts) {
    return [];
  }

  try {
    return parseQuizPerformanceAttempts(JSON.parse(rawAttempts) as unknown);
  } catch {
    return [];
  }
}

export async function getQuizPerformanceAttempts(): Promise<QuizPerformanceAttempt[]> {
  await storageOperations.waitForIdle();
  const storedAttempts = await AsyncStorage.getItem(QUIZ_PERFORMANCE_STORAGE_KEY);
  return parseStoredAttempts(storedAttempts);
}

export function saveQuizPerformanceAttempt(
  attempt: QuizPerformanceAttempt,
): Promise<QuizPerformanceAttempt[]> {
  return storageOperations.enqueue(async () => {
    const storedAttempts = await AsyncStorage.getItem(QUIZ_PERFORMANCE_STORAGE_KEY);
    const attempts = parseStoredAttempts(storedAttempts);

    if (attempts.some((storedAttempt) => storedAttempt.id === attempt.id)) {
      return attempts;
    }

    const updatedAttempts = parseQuizPerformanceAttempts([attempt, ...attempts]);
    await AsyncStorage.setItem(
      QUIZ_PERFORMANCE_STORAGE_KEY,
      JSON.stringify(updatedAttempts),
    );
    return updatedAttempts;
  });
}

export function clearQuizPerformanceAttempts(): Promise<void> {
  return storageOperations.enqueue(() =>
    AsyncStorage.removeItem(QUIZ_PERFORMANCE_STORAGE_KEY),
  );
}
