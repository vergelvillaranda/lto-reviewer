import type {
  QuizAnswer,
  QuizCategory,
  QuizQuestion,
  QuizResult,
  QuizSessionQuestion,
} from '@/types/quiz';
import {
  createSessionQuestion,
  fisherYatesShuffle,
  getUniqueQuestions,
  type RandomSource,
} from '@/utils/randomization';

export function getAvailableQuestionCount(
  questions: readonly QuizQuestion[],
  category: QuizCategory,
): number {
  const filtered =
    category === 'All Questions'
      ? questions
      : questions.filter((question) => question.category === category);
  return getUniqueQuestions(filtered).length;
}

export function createQuizQuestions(
  questions: readonly QuizQuestion[],
  category: QuizCategory,
  requestedCount: number,
  random: RandomSource = Math.random,
): QuizSessionQuestion[] {
  const filtered =
    category === 'All Questions'
      ? questions
      : questions.filter((question) => question.category === category);
  const uniqueQuestions = getUniqueQuestions(filtered);
  const selectedQuestions = fisherYatesShuffle(uniqueQuestions, random).slice(
    0,
    Math.max(0, Math.min(requestedCount, uniqueQuestions.length)),
  );

  return selectedQuestions.map((question) => createSessionQuestion(question, random));
}

export function calculateQuizResult(
  quizQuestions: readonly QuizSessionQuestion[],
  answers: readonly QuizAnswer[],
): QuizResult {
  const answerByQuestionId = new Map(answers.map((answer) => [answer.questionId, answer]));
  const incorrectAnswers = quizQuestions.flatMap((question) => {
    const answer = answerByQuestionId.get(question.id);
    return answer && !answer.isCorrect ? [{ question, answer }] : [];
  });
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const total = quizQuestions.length;

  return {
    total,
    correct,
    incorrect: total - correct,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    incorrectAnswers,
  };
}
