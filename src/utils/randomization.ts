import type {
  AnswerId,
  QuizQuestion,
  QuizSessionChoice,
  QuizSessionQuestion,
} from '@/types/quiz';

export type RandomSource = () => number;

export function getUniqueQuestions(
  questions: readonly QuizQuestion[],
): QuizQuestion[] {
  const seenIds = new Set<string>();
  const seenPrompts = new Set<string>();

  return questions.filter((question) => {
    const normalizedPrompt = question.prompt.trim().replace(/\s+/g, ' ').toLowerCase();
    if (seenIds.has(question.id) || seenPrompts.has(normalizedPrompt)) {
      return false;
    }
    seenIds.add(question.id);
    seenPrompts.add(normalizedPrompt);
    return true;
  });
}

export function fisherYatesShuffle<T>(
  values: readonly T[],
  random: RandomSource = Math.random,
): T[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomValue = random();
    if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
      throw new RangeError('Random source must return a finite number from 0 up to, but not including, 1.');
    }
    const swapIndex = Math.floor(randomValue * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function getStableAnswerId(questionId: string, sourceIndex: number): AnswerId {
  return `${questionId}:answer:${sourceIndex + 1}`;
}

export function getCorrectAnswerId(question: QuizQuestion): AnswerId {
  return getStableAnswerId(question.id, question.correctAnswerIndex);
}

export function createSessionQuestion(
  question: QuizQuestion,
  random: RandomSource = Math.random,
  shuffleChoices = true,
): QuizSessionQuestion {
  const choices: QuizSessionChoice[] = question.choices.map((text, sourceIndex) => ({
    id: getStableAnswerId(question.id, sourceIndex),
    text,
    isCorrect: sourceIndex === question.correctAnswerIndex,
  }));

  return {
    id: question.id,
    category: question.category,
    prompt: question.prompt,
    choices: shuffleChoices ? fisherYatesShuffle(choices, random) : choices,
    explanation: question.explanation,
    source: question.source,
  };
}

export function getSelectedChoice(
  question: QuizSessionQuestion,
  answerId: AnswerId,
): QuizSessionChoice | undefined {
  return question.choices.find((choice) => choice.id === answerId);
}

export function getCorrectChoice(
  question: QuizSessionQuestion,
): QuizSessionChoice | undefined {
  return question.choices.find((choice) => choice.isCorrect);
}
