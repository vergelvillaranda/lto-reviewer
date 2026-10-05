import type { ExamHistoryRecord } from '@/types/exam-history';
import type {
  MockExamAnswer,
  MockExamReviewFilter,
  MockExamReviewItem,
} from '@/types/mock-exam';
import type { QuizQuestion, QuizSessionQuestion } from '@/types/quiz';
import { getMockExamQuestionStatus } from '@/utils/mock-exam';
import { createSessionQuestion } from '@/utils/randomization';

export type MockExamReviewCounts = Record<MockExamReviewFilter, number>;

export function createMockExamReviewItems(
  examQuestions: readonly QuizSessionQuestion[],
  answers: readonly MockExamAnswer[],
): MockExamReviewItem[] {
  const answerByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer]),
  );

  return examQuestions.map((question, index) => {
    const answer = answerByQuestionId.get(question.id);
    return {
      answer,
      question,
      questionNumber: index + 1,
      status: getMockExamQuestionStatus(question, answer),
    };
  });
}

export function createHistoricalMockExamReviewItems(
  questionBank: readonly QuizQuestion[],
  record: ExamHistoryRecord,
): MockExamReviewItem[] {
  const questionById = new Map(
    questionBank.map((question) => [question.id, question]),
  );
  const answerByQuestionId = new Map(
    record.answers.map((answer) => [answer.questionId, answer]),
  );

  return record.questionIds.reduce<MockExamReviewItem[]>((items, questionId, index) => {
    const question = questionById.get(questionId);
    if (!question) {
      return items;
    }

    const reviewQuestion = createSessionQuestion(question, Math.random, false);
    const answer = answerByQuestionId.get(questionId);
    items.push({
      answer,
      question: reviewQuestion,
      questionNumber: index + 1,
      status: getMockExamQuestionStatus(reviewQuestion, answer),
    });
    return items;
  }, []);
}

export function countMockExamReviewItems(
  items: readonly MockExamReviewItem[],
): MockExamReviewCounts {
  const counts: MockExamReviewCounts = {
    All: items.length,
    Incorrect: 0,
    Correct: 0,
    Unanswered: 0,
  };

  items.forEach((item) => {
    counts[item.status] += 1;
  });
  return counts;
}

export function filterMockExamReviewItems(
  items: readonly MockExamReviewItem[],
  filter: MockExamReviewFilter,
): MockExamReviewItem[] {
  return filter === 'All'
    ? [...items]
    : items.filter((item) => item.status === filter);
}
