export const MISTAKE_MASTERY_CORRECT_STREAK = 3;

export interface MistakeRecord {
  questionId: string;
  timesAnsweredIncorrectly: number;
  timesAnsweredCorrectly: number;
  consecutiveCorrectAnswers: number;
  lastIncorrectAt: string;
}

export interface MistakeOutcome {
  questionId: string;
  isCorrect: boolean;
}
