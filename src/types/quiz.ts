export const quizCategories = [
  'All Questions',
  'Road Signs',
  'Traffic Rules',
  'Penalties',
  'Defensive Driving',
  'General & Republic Acts',
] as const;

export type QuizCategory = (typeof quizCategories)[number];
export type QuestionCategory = Exclude<QuizCategory, 'All Questions'>;

export const questionCounts = [10, 20, 30] as const;
export type QuestionCount = (typeof questionCounts)[number];

export type AnswerIndex = 0 | 1 | 2 | 3;
export type AnswerChoices = readonly [string, string, string, string];
export type AnswerId = string;

export interface QuizSessionChoice {
  id: AnswerId;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  category: QuestionCategory;
  prompt: string;
  choices: AnswerChoices;
  correctAnswerIndex: AnswerIndex;
  explanation: string;
  source?: string;
}

export interface QuizSessionQuestion
  extends Omit<QuizQuestion, 'choices' | 'correctAnswerIndex'> {
  choices: readonly QuizSessionChoice[];
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswerId: AnswerId;
  isCorrect: boolean;
}

export interface IncorrectAnswerReference {
  question: QuizSessionQuestion;
  answer: QuizAnswer;
}

export interface QuizResult {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  incorrectAnswers: IncorrectAnswerReference[];
}
