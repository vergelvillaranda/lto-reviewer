import {
  MISTAKE_MASTERY_CORRECT_STREAK,
  type MistakeRecord,
} from '@/types/mistake-tracking';
import type { QuizQuestion } from '@/types/quiz';

export function needsMistakeReview(record: MistakeRecord): boolean {
  return record.consecutiveCorrectAnswers < MISTAKE_MASTERY_CORRECT_STREAK;
}

export function createMistakeReviewQuestions(
  questionBank: readonly QuizQuestion[],
  records: readonly MistakeRecord[],
): QuizQuestion[] {
  const questionById = new Map(questionBank.map((question) => [question.id, question]));

  return records
    .filter(needsMistakeReview)
    .sort((first, second) => {
      if (first.timesAnsweredIncorrectly !== second.timesAnsweredIncorrectly) {
        return second.timesAnsweredIncorrectly - first.timesAnsweredIncorrectly;
      }
      const dateDifference =
        Date.parse(second.lastIncorrectAt) - Date.parse(first.lastIncorrectAt);
      return dateDifference !== 0
        ? dateDifference
        : first.questionId.localeCompare(second.questionId);
    })
    .flatMap((record) => {
      const question = questionById.get(record.questionId);
      return question ? [question] : [];
    });
}
