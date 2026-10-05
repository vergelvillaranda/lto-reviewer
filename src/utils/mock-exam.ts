import type {
  MockExamAnswer,
  MockExamQuestionStatus,
  MockExamResult,
} from '@/types/mock-exam';
import { MOCK_EXAM_QUESTION_COUNT } from '@/types/mock-exam';
import type {
  QuizQuestion,
  QuizSessionChoice,
  QuizSessionQuestion,
} from '@/types/quiz';
import {
  createSessionQuestion,
  fisherYatesShuffle,
  getCorrectAnswerId,
  getUniqueQuestions,
  type RandomSource,
} from '@/utils/randomization';

interface MockExamPerformanceMessage {
  title: string;
  description: string;
}

export function getMockExamSelectedChoice(
  question: QuizSessionQuestion,
  answer: MockExamAnswer,
): QuizSessionChoice | undefined {
  return 'selectedAnswerId' in answer
    ? question.choices.find((choice) => choice.id === answer.selectedAnswerId)
    : question.choices[answer.selectedAnswerIndex];
}

export function getMockExamQuestionStatus(
  question: QuizSessionQuestion,
  answer?: MockExamAnswer,
): MockExamQuestionStatus {
  if (!answer) {
    return 'Unanswered';
  }
  const selectedChoice = getMockExamSelectedChoice(question, answer);
  return selectedChoice?.isCorrect ? 'Correct' : 'Incorrect';
}

export function isStoredMockExamAnswerCorrect(
  question: QuizQuestion,
  answer: MockExamAnswer,
): boolean {
  return 'selectedAnswerId' in answer
    ? answer.selectedAnswerId === getCorrectAnswerId(question)
    : answer.selectedAnswerIndex === question.correctAnswerIndex;
}

export function getMockExamPerformanceMessage(
  percentage: number,
): MockExamPerformanceMessage {
  if (percentage >= 90) {
    return {
      title: 'Excellent practice performance',
      description: 'You showed a strong command of the material. Review any misses to stay sharp.',
    };
  }
  if (percentage >= 75) {
    return {
      title: 'Strong practice result',
      description: 'You are building solid exam readiness. Review missed topics before your next attempt.',
    };
  }
  if (percentage >= 60) {
    return {
      title: 'Good progress',
      description: 'Your foundation is growing. Focus on incorrect and unanswered items, then try again.',
    };
  }
  return {
    title: 'Keep practicing',
    description: 'Use the answer review to identify weak topics and improve on your next mock exam.',
  };
}

export function createMockExamQuestions(
  questionBank: readonly QuizQuestion[],
  requestedCount: number = MOCK_EXAM_QUESTION_COUNT,
  random: RandomSource = Math.random,
): QuizSessionQuestion[] {
  const uniqueQuestions = getUniqueQuestions(questionBank);

  const selectedQuestions = fisherYatesShuffle(uniqueQuestions, random).slice(
    0,
    Math.max(0, Math.min(requestedCount, uniqueQuestions.length)),
  );
  return selectedQuestions.map((question) => createSessionQuestion(question, random));
}

export function calculateMockExamResult(
  examQuestions: readonly QuizSessionQuestion[],
  answers: readonly MockExamAnswer[],
): MockExamResult {
  const answerByQuestionId = new Map(answers.map((answer) => [answer.questionId, answer]));
  const correct = examQuestions.reduce((total, question) => {
    const answer = answerByQuestionId.get(question.id);
    return total + (getMockExamQuestionStatus(question, answer) === 'Correct' ? 1 : 0);
  }, 0);
  const answered = examQuestions.filter((question) => answerByQuestionId.has(question.id)).length;
  const total = examQuestions.length;
  const unanswered = total - answered;

  return {
    total,
    correct,
    incorrect: answered - correct,
    unanswered,
    score: correct,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 1000) / 10,
  };
}
