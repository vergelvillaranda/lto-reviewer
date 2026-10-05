import type { MockExamAnswer } from '@/types/mock-exam';

export interface ExamHistoryRecord {
  id: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
  questionIds: string[];
  answers: MockExamAnswer[];
}
