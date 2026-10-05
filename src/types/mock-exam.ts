import type { AnswerId, AnswerIndex, QuizSessionQuestion } from '@/types/quiz';

export const MOCK_EXAM_QUESTION_COUNT = 60;

export const mockExamReviewFilters = [
  'All',
  'Incorrect',
  'Correct',
  'Unanswered',
] as const;

export type MockExamReviewFilter = (typeof mockExamReviewFilters)[number];
export type MockExamQuestionStatus = Exclude<MockExamReviewFilter, 'All'>;

interface StableMockExamAnswer {
  questionId: string;
  selectedAnswerId: AnswerId;
  selectedAnswerIndex?: never;
}

interface LegacyMockExamAnswer {
  questionId: string;
  selectedAnswerId?: never;
  selectedAnswerIndex: AnswerIndex;
}

export type MockExamAnswer = StableMockExamAnswer | LegacyMockExamAnswer;

export interface MockExamResult {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
  percentage: number;
}

export interface MockExamReviewItem {
  answer?: MockExamAnswer;
  question: QuizSessionQuestion;
  questionNumber: number;
  status: MockExamQuestionStatus;
}
