import { create } from 'zustand';

import { questions } from '@/data/questions';
import { useMistakeTrackingStore } from '@/stores/mistake-tracking-store';
import { useQuizPerformanceStore } from '@/stores/quiz-performance-store';
import type { QuizPerformanceAttempt } from '@/types/performance';
import type {
  AnswerId,
  QuestionCount,
  QuizAnswer,
  QuizCategory,
  QuizSessionQuestion,
} from '@/types/quiz';
import { createQuizQuestions } from '@/utils/quiz';
import { createSessionQuestion, fisherYatesShuffle } from '@/utils/randomization';

interface QuizState {
  category: QuizCategory;
  requestedCount: number;
  quizQuestions: QuizSessionQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  completionError: string | null;
  quizId: string | null;
  startQuiz: (category: QuizCategory, count: QuestionCount) => void;
  startBookmarkedQuiz: (questionIds: readonly string[]) => number;
  answerCurrentQuestion: (answerId: AnswerId) => boolean | null;
  nextQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
}

const initialQuizState = {
  category: 'All Questions' as QuizCategory,
  requestedCount: 10 as QuestionCount,
  quizQuestions: [] as QuizSessionQuestion[],
  currentQuestionIndex: 0,
  answers: [] as QuizAnswer[],
  isComplete: false,
  completionError: null as string | null,
  quizId: null as string | null,
};

function createQuizId(): string {
  return `quiz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  ...initialQuizState,

  startQuiz: (category, count) => {
    set({
      category,
      requestedCount: count,
      quizQuestions: createQuizQuestions(questions, category, count),
      currentQuestionIndex: 0,
      answers: [],
      isComplete: false,
      completionError: null,
      quizId: createQuizId(),
    });
  },

  startBookmarkedQuiz: (questionIds) => {
    const questionById = new Map(questions.map((question) => [question.id, question]));
    const uniqueQuestionIds = [...new Set(questionIds)];
    const sourceQuestions = uniqueQuestionIds.flatMap((questionId) => {
      const question = questionById.get(questionId);
      return question ? [question] : [];
    });
    const quizQuestions = fisherYatesShuffle(sourceQuestions).map((question) =>
      createSessionQuestion(question),
    );
    set({
      category: 'All Questions',
      requestedCount: quizQuestions.length,
      quizQuestions,
      currentQuestionIndex: 0,
      answers: [],
      isComplete: false,
      completionError: null,
      quizId: createQuizId(),
    });
    return quizQuestions.length;
  },

  answerCurrentQuestion: (answerId) => {
    const { answers, currentQuestionIndex, quizQuestions } = get();
    const question = quizQuestions[currentQuestionIndex];

    if (!question || answers.some((answer) => answer.questionId === question.id)) {
      return null;
    }

    const selectedChoice = question.choices.find((choice) => choice.id === answerId);
    if (!selectedChoice) {
      return null;
    }
    const isCorrect = selectedChoice.isCorrect;
    set({
      answers: [
        ...answers,
        {
          questionId: question.id,
          selectedAnswerId: answerId,
          isCorrect,
        },
      ],
    });

    void useMistakeTrackingStore.getState().recordOutcome({
      questionId: question.id,
      isCorrect,
    });

    return isCorrect;
  },

  nextQuestion: () => {
    const { currentQuestionIndex, quizQuestions } = get();
    if (currentQuestionIndex < quizQuestions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  finishQuiz: async () => {
    const { answers, isComplete, quizId, quizQuestions } = get();
    if (isComplete || !quizId || quizQuestions.length === 0) {
      return;
    }

    set({ isComplete: true });
    if (answers.length !== quizQuestions.length) {
      return;
    }

    const correct = answers.filter((answer) => answer.isCorrect).length;
    const attempt: QuizPerformanceAttempt = {
      id: quizId,
      completedAt: new Date().toISOString(),
      totalQuestions: quizQuestions.length,
      correct,
      incorrect: quizQuestions.length - correct,
      percentage: Math.round((correct / quizQuestions.length) * 1000) / 10,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        isCorrect: answer.isCorrect,
      })),
    };

    const saved = await useQuizPerformanceStore.getState().saveAttempt(attempt);
    if (!saved) {
      set({
        completionError:
          'Your result is available now, but it could not be added to Statistics.',
      });
    }
  },

  resetQuiz: () => set({ ...initialQuizState, quizQuestions: [], answers: [] }),
}));
