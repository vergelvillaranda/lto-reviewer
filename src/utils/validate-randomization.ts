import { MOCK_EXAM_QUESTION_COUNT } from '@/types/mock-exam';
import {
  quizCategories,
  type QuestionCategory,
  type QuizQuestion,
  type QuizSessionQuestion,
} from '@/types/quiz';
import { createMockExamQuestions } from '@/utils/mock-exam';
import { createQuizQuestions } from '@/utils/quiz';
import { getCorrectAnswerId, getStableAnswerId } from '@/utils/randomization';

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function validateSessionQuestion(
  question: QuizSessionQuestion,
  sourceQuestion: QuizQuestion | undefined,
  errors: string[],
): void {
  if (!sourceQuestion) {
    errors.push(`${question.id} does not exist in the source question bank.`);
    return;
  }

  const correctChoices = question.choices.filter((choice) => choice.isCorrect);
  if (correctChoices.length !== 1) {
    errors.push(`${question.id} must have exactly one correct shuffled choice.`);
  } else if (correctChoices[0].id !== getCorrectAnswerId(sourceQuestion)) {
    errors.push(`${question.id} lost its correct answer identity while shuffling.`);
  }

  const expectedChoiceIds = new Set(
    sourceQuestion.choices.map((_, index) => getStableAnswerId(sourceQuestion.id, index)),
  );
  const actualChoiceIds = new Set(question.choices.map((choice) => choice.id));
  if (
    actualChoiceIds.size !== question.choices.length ||
    actualChoiceIds.size !== expectedChoiceIds.size ||
    [...actualChoiceIds].some((answerId) => !expectedChoiceIds.has(answerId))
  ) {
    errors.push(`${question.id} has missing or duplicate answer IDs after shuffling.`);
  }
}

function validateUniqueQuestionIds(
  label: string,
  questions: readonly QuizSessionQuestion[],
  errors: string[],
): void {
  if (new Set(questions.map((question) => question.id)).size !== questions.length) {
    errors.push(`${label} contains duplicate question IDs.`);
  }
}

export function getRandomizationValidationErrors(
  questionBank: readonly QuizQuestion[],
): string[] {
  const errors: string[] = [];
  const originalSnapshot = JSON.stringify(questionBank);
  const sourceById = new Map(questionBank.map((question) => [question.id, question]));

  const firstExam = createMockExamQuestions(
    questionBank,
    MOCK_EXAM_QUESTION_COUNT,
    createSeededRandom(2026),
  );
  const secondExam = createMockExamQuestions(
    questionBank,
    MOCK_EXAM_QUESTION_COUNT,
    createSeededRandom(4136),
  );

  if (firstExam.length !== MOCK_EXAM_QUESTION_COUNT) {
    errors.push(
      `Mock Exam must contain ${MOCK_EXAM_QUESTION_COUNT} questions; found ${firstExam.length}.`,
    );
  }
  validateUniqueQuestionIds('Mock Exam', firstExam, errors);
  firstExam.forEach((question) =>
    validateSessionQuestion(question, sourceById.get(question.id), errors),
  );
  const hasShuffledChoices = firstExam.some((question) => {
    const sourceQuestion = sourceById.get(question.id);
    return sourceQuestion
      ? question.choices.some(
          (choice, index) => choice.id !== getStableAnswerId(sourceQuestion.id, index),
        )
      : false;
  });
  if (!hasShuffledChoices) {
    errors.push('Mock Exam answer choices were not shuffled.');
  }

  if (
    firstExam.map((question) => question.id).join('|') ===
    secondExam.map((question) => question.id).join('|')
  ) {
    errors.push('New Mock Exams produced the same deterministic question order.');
  }

  const categories = quizCategories.filter(
    (category): category is QuestionCategory => category !== 'All Questions',
  );
  categories.forEach((category, index) => {
    const available = questionBank.filter((question) => question.category === category).length;
    const quiz = createQuizQuestions(
      questionBank,
      category,
      30,
      createSeededRandom(100 + index),
    );
    const expectedCount = Math.min(30, available);
    if (quiz.length !== expectedCount) {
      errors.push(`${category} quiz expected ${expectedCount} questions; found ${quiz.length}.`);
    }
    if (quiz.some((question) => question.category !== category)) {
      errors.push(`${category} quiz contains a question from another category.`);
    }
    validateUniqueQuestionIds(`${category} quiz`, quiz, errors);
    quiz.forEach((question) =>
      validateSessionQuestion(question, sourceById.get(question.id), errors),
    );
  });

  if (JSON.stringify(questionBank) !== originalSnapshot) {
    errors.push('Question randomization mutated the original question database.');
  }

  return errors;
}

export function assertValidRandomization(questionBank: readonly QuizQuestion[]): void {
  const errors = getRandomizationValidationErrors(questionBank);
  if (errors.length > 0) {
    throw new Error(`Invalid question randomization:\n${errors.join('\n')}`);
  }
}
