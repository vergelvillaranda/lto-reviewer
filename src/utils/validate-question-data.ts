import type { QuestionCategory, QuizQuestion } from '@/types/quiz';

const expectedCategoryCounts: Readonly<Record<QuestionCategory, number>> = {
  'Road Signs': 30,
  'Traffic Rules': 22,
  Penalties: 12,
  'Defensive Driving': 8,
  'General & Republic Acts': 3,
};

function expectedCategoryForId(id: string): QuestionCategory | null {
  const match = /^q(\d+)$/.exec(id);
  if (!match) {
    return null;
  }

  const questionNumber = Number(match[1]);
  if (questionNumber >= 1 && questionNumber <= 30) return 'Road Signs';
  if (questionNumber <= 52) return 'Traffic Rules';
  if (questionNumber <= 64) return 'Penalties';
  if (questionNumber <= 72) return 'Defensive Driving';
  if (questionNumber <= 75) return 'General & Republic Acts';
  return null;
}

function normalizeQuestion(prompt: string): string {
  return prompt.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

export function getQuestionDataValidationErrors(
  questions: readonly QuizQuestion[],
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const prompts = new Set<string>();
  const categoryCounts: Record<QuestionCategory, number> = {
    'Road Signs': 0,
    'Traffic Rules': 0,
    Penalties: 0,
    'Defensive Driving': 0,
    'General & Republic Acts': 0,
  };

  if (questions.length !== 75) {
    errors.push(`Expected 75 questions, found ${questions.length}.`);
  }

  for (const question of questions) {
    if (ids.has(question.id)) {
      errors.push(`Duplicate question ID: ${question.id}.`);
    }
    ids.add(question.id);

    const normalizedPrompt = normalizeQuestion(question.prompt);
    if (!normalizedPrompt) {
      errors.push(`${question.id} has an empty question prompt.`);
    } else if (prompts.has(normalizedPrompt)) {
      errors.push(`Duplicate question prompt: ${question.id}.`);
    }
    prompts.add(normalizedPrompt);

    if (question.choices.length !== 4) {
      errors.push(`${question.id} must have exactly four answer choices.`);
    }
    if (question.choices.some((choice) => choice.trim().length === 0)) {
      errors.push(`${question.id} contains an empty answer choice.`);
    }
    if (new Set(question.choices).size !== question.choices.length) {
      errors.push(`${question.id} contains duplicate answer choices.`);
    }
    if (
      !Number.isInteger(question.correctAnswerIndex) ||
      question.correctAnswerIndex < 0 ||
      question.correctAnswerIndex >= question.choices.length
    ) {
      errors.push(`${question.id} has an invalid correct answer index.`);
    }

    const expectedCategory = expectedCategoryForId(question.id);
    if (!expectedCategory) {
      errors.push(`${question.id} is not a stable PDF question ID from q1 through q75.`);
    } else if (question.category !== expectedCategory) {
      errors.push(
        `${question.id} is categorized as ${question.category}; expected ${expectedCategory}.`,
      );
    }

    categoryCounts[question.category] += 1;

    if (!question.explanation.trim()) {
      errors.push(`${question.id} has no answer-key explanation.`);
    }
    if (!question.source?.trim()) {
      errors.push(`${question.id} has no answer-key source.`);
    }
  }

  for (const [category, expectedCount] of Object.entries(expectedCategoryCounts) as [
    QuestionCategory,
    number,
  ][]) {
    const actualCount = categoryCounts[category];
    if (actualCount !== expectedCount) {
      errors.push(`${category}: expected ${expectedCount}, found ${actualCount}.`);
    }
  }

  return errors;
}

export function assertValidQuestionData(questions: readonly QuizQuestion[]): void {
  const errors = getQuestionDataValidationErrors(questions);
  if (errors.length > 0) {
    throw new Error(`Invalid LTO question data:\n${errors.join('\n')}`);
  }
}
