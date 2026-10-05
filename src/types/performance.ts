import type { QuestionCategory } from '@/types/quiz';

export interface QuizPerformanceAnswer {
  questionId: string;
  isCorrect: boolean;
}

export interface QuizPerformanceAttempt {
  id: string;
  completedAt: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  percentage: number;
  answers: QuizPerformanceAnswer[];
}

export interface CategoryPerformance {
  category: QuestionCategory;
  questionsAnswered: number;
  correct: number;
  incorrect: number;
  accuracy: number | null;
}

export interface PerformanceStatistics {
  examsTaken: number;
  averageScore: number | null;
  bestScore: number | null;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  overallAccuracy: number | null;
  categories: CategoryPerformance[];
  weakestCategory: CategoryPerformance | null;
}
