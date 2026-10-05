import type { ExamHistoryRecord } from '@/types/exam-history';
import type {
  CategoryPerformance,
  PerformanceStatistics,
  QuizPerformanceAttempt,
} from '@/types/performance';
import { quizCategories, type QuestionCategory, type QuizQuestion } from '@/types/quiz';
import { isStoredMockExamAnswerCorrect } from '@/utils/mock-exam';

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function calculateAccuracy(correct: number, answered: number): number | null {
  return answered === 0 ? null : roundToOneDecimal((correct / answered) * 100);
}

export function calculatePerformanceStatistics(
  questionBank: readonly QuizQuestion[],
  examHistory: readonly ExamHistoryRecord[],
  quizAttempts: readonly QuizPerformanceAttempt[],
): PerformanceStatistics {
  const categories = quizCategories.filter(
    (category): category is QuestionCategory => category !== 'All Questions',
  );
  const categoryTotals = new Map<QuestionCategory, { answered: number; correct: number }>(
    categories.map((category) => [category, { answered: 0, correct: 0 }]),
  );
  const questionById = new Map(questionBank.map((question) => [question.id, question]));

  const addCategoryAnswer = (questionId: string, isCorrect: boolean) => {
    const question = questionById.get(questionId);
    if (!question) {
      return;
    }
    const totals = categoryTotals.get(question.category);
    if (!totals) {
      return;
    }
    totals.answered += 1;
    totals.correct += isCorrect ? 1 : 0;
  };

  quizAttempts.forEach((attempt) => {
    attempt.answers.forEach((answer) => {
      addCategoryAnswer(answer.questionId, answer.isCorrect);
    });
  });

  examHistory.forEach((exam) => {
    exam.answers.forEach((answer) => {
      const question = questionById.get(answer.questionId);
      if (question) {
        addCategoryAnswer(
          answer.questionId,
          isStoredMockExamAnswerCorrect(question, answer),
        );
      }
    });
  });

  const categoriesPerformance = categories.map<CategoryPerformance>((category) => {
    const totals = categoryTotals.get(category) ?? { answered: 0, correct: 0 };
    return {
      category,
      questionsAnswered: totals.answered,
      correct: totals.correct,
      incorrect: totals.answered - totals.correct,
      accuracy: calculateAccuracy(totals.correct, totals.answered),
    };
  });
  const categoriesWithData = categoriesPerformance.filter(
    (category) => category.accuracy !== null,
  );
  const weakestCategory = categoriesWithData.reduce<CategoryPerformance | null>(
    (weakest, category) =>
      !weakest || (category.accuracy ?? 0) < (weakest.accuracy ?? 0)
        ? category
        : weakest,
    null,
  );

  const examPercentages = examHistory.map((exam) => exam.percentage);
  const examAnswered = examHistory.reduce(
    (total, exam) => total + exam.correct + exam.incorrect,
    0,
  );
  const examCorrect = examHistory.reduce((total, exam) => total + exam.correct, 0);
  const quizAnswered = quizAttempts.reduce(
    (total, attempt) => total + attempt.totalQuestions,
    0,
  );
  const quizCorrect = quizAttempts.reduce((total, attempt) => total + attempt.correct, 0);
  const totalQuestionsAnswered = examAnswered + quizAnswered;
  const totalCorrect = examCorrect + quizCorrect;

  return {
    examsTaken: examHistory.length,
    averageScore:
      examPercentages.length === 0
        ? null
        : roundToOneDecimal(
            examPercentages.reduce((total, percentage) => total + percentage, 0) /
              examPercentages.length,
          ),
    bestScore: examPercentages.length === 0 ? null : Math.max(...examPercentages),
    totalQuestionsAnswered,
    totalCorrect,
    totalIncorrect: totalQuestionsAnswered - totalCorrect,
    overallAccuracy: calculateAccuracy(totalCorrect, totalQuestionsAnswered),
    categories: categoriesPerformance,
    weakestCategory,
  };
}
