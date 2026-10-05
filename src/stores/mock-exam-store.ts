import { create } from 'zustand';

import { questions } from '@/data/questions';
import { useExamHistoryStore } from '@/stores/exam-history-store';
import { useMistakeTrackingStore } from '@/stores/mistake-tracking-store';
import type { ExamHistoryRecord } from '@/types/exam-history';
import type { MockExamAnswer } from '@/types/mock-exam';
import type { AnswerId, QuizSessionQuestion } from '@/types/quiz';
import {
  calculateMockExamResult,
  createMockExamQuestions,
  getMockExamQuestionStatus,
} from '@/utils/mock-exam';

interface MockExamState {
  examQuestions: QuizSessionQuestion[];
  currentQuestionIndex: number;
  answers: MockExamAnswer[];
  isSubmitted: boolean;
  submissionError: string | null;
  examId: string | null;
  startMockExam: () => number;
  selectAnswer: (answerId: AnswerId) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitExam: () => Promise<void>;
  resetMockExam: () => void;
}

const initialMockExamState = {
  examQuestions: [] as QuizSessionQuestion[],
  currentQuestionIndex: 0,
  answers: [] as MockExamAnswer[],
  isSubmitted: false,
  submissionError: null as string | null,
  examId: null as string | null,
};

function createExamId(): string {
  return `exam-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useMockExamStore = create<MockExamState>((set, get) => ({
  ...initialMockExamState,

  startMockExam: () => {
    const examQuestions = createMockExamQuestions(questions);
    set({
      examQuestions,
      currentQuestionIndex: 0,
      answers: [],
      isSubmitted: false,
      submissionError: null,
      examId: createExamId(),
    });
    return examQuestions.length;
  },

  selectAnswer: (answerId) => {
    const { answers, currentQuestionIndex, examQuestions, isSubmitted } = get();
    const question = examQuestions[currentQuestionIndex];
    if (!question || isSubmitted || !question.choices.some((choice) => choice.id === answerId)) {
      return;
    }

    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.questionId === question.id,
    );
    if (existingAnswerIndex === -1) {
      set({ answers: [...answers, { questionId: question.id, selectedAnswerId: answerId }] });
      return;
    }

    const updatedAnswers = [...answers];
    updatedAnswers[existingAnswerIndex] = {
      questionId: question.id,
      selectedAnswerId: answerId,
    };
    set({ answers: updatedAnswers });
  },

  goToQuestion: (index) => {
    const { examQuestions, isSubmitted } = get();
    if (!isSubmitted && index >= 0 && index < examQuestions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, examQuestions, isSubmitted } = get();
    if (!isSubmitted && currentQuestionIndex < examQuestions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex, isSubmitted } = get();
    if (!isSubmitted && currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  submitExam: async () => {
    const { answers, examId, examQuestions, isSubmitted } = get();
    if (isSubmitted || !examId || examQuestions.length === 0) {
      return;
    }

    set({ isSubmitted: true });
    const result = calculateMockExamResult(examQuestions, answers);
    const record: ExamHistoryRecord = {
      id: examId,
      completedAt: new Date().toISOString(),
      score: result.score,
      totalQuestions: result.total,
      correct: result.correct,
      incorrect: result.incorrect,
      unanswered: result.unanswered,
      percentage: result.percentage,
      questionIds: examQuestions.map((question) => question.id),
      answers: answers.map((answer) => ({ ...answer })),
    };

    const questionById = new Map(examQuestions.map((question) => [question.id, question]));
    const mistakeOutcomes = answers.flatMap((answer) => {
      const answeredQuestion = questionById.get(answer.questionId);
      return answeredQuestion
        ? [{
            questionId: answer.questionId,
            isCorrect: getMockExamQuestionStatus(answeredQuestion, answer) === 'Correct',
          }]
        : [];
    });

    const [historySaved, mistakesSaved] = await Promise.all([
      useExamHistoryStore.getState().saveRecord(record),
      useMistakeTrackingStore.getState().recordOutcomes(mistakeOutcomes),
    ]);

    if (!historySaved) {
      set({
        submissionError:
          'Your result is available now, but it could not be saved to Exam History.',
      });
    } else if (!mistakesSaved) {
      set({
        submissionError:
          'Your result was saved, but mistake tracking could not be updated.',
      });
    }
  },

  resetMockExam: () =>
    set({ ...initialMockExamState, examQuestions: [], answers: [] }),
}));
