import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowRight, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerButton, type AnswerButtonState } from '@/components/quiz/answer-button';
import { AnswerFeedbackCard } from '@/components/quiz/answer-feedback-card';
import { ProgressBar } from '@/components/quiz/progress-bar';
import { QuestionCard } from '@/components/quiz/question-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { useAndroidBackHandler } from '@/hooks/use-android-back-handler';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useHapticPreferenceStore } from '@/stores/haptic-preference-store';
import { useQuizStore } from '@/stores/quiz-store';
import type { AnswerId, QuizSessionChoice } from '@/types/quiz';

const answerLetters = ['A', 'B', 'C', 'D'] as const;

export default function QuizScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const scrollRef = useRef<ScrollView>(null);
  const isHapticFeedbackEnabled = useHapticPreferenceStore(
    (state) => state.hasLoaded && state.isEnabled,
  );
  const quizQuestions = useQuizStore((state) => state.quizQuestions);
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestionIndex);
  const answers = useQuizStore((state) => state.answers);
  const answerCurrentQuestion = useQuizStore((state) => state.answerCurrentQuestion);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);
  const finishQuiz = useQuizStore((state) => state.finishQuiz);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const question = quizQuestions[currentQuestionIndex];
  const currentAnswer = question
    ? answers.find((answer) => answer.questionId === question.id)
    : undefined;
  const isFinalQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleExit = useCallback(() => {
    resetQuiz();
    router.replace('/');
    return true;
  }, [resetQuiz]);

  useAndroidBackHandler(handleExit);

  useEffect(() => {
    if (quizQuestions.length === 0) {
      router.replace('/');
    }
  }, [quizQuestions.length]);

  if (!question) {
    return <ThemedView style={styles.screen} />;
  }

  const handleAnswer = (answerId: AnswerId) => {
    const isCorrect = answerCurrentQuestion(answerId);
    if (isCorrect === null) {
      return;
    }

    if (isHapticFeedbackEnabled) {
      void Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      ).catch(() => undefined);
    }
  };

  const handleContinue = async () => {
    if (isFinalQuestion) {
      await finishQuiz();
      router.replace('/results');
      return;
    }

    nextQuestion();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const getAnswerState = (choice: QuizSessionChoice): AnswerButtonState => {
    if (!currentAnswer) {
      return 'default';
    }
    if (choice.isCorrect) {
      return 'correct';
    }
    if (choice.id === currentAnswer.selectedAnswerId) {
      return 'incorrect';
    }
    return 'dimmed';
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}>
          <View style={styles.progressCopy}>
            <ThemedText style={styles.questionNumber}>
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.progressPercent}>
              {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%
            </ThemedText>
          </View>
          <Pressable
            accessibilityLabel="Exit quiz"
            accessibilityRole="button"
            hitSlop={10}
            onPress={handleExit}
            style={({ pressed }) => [styles.exitButton, pressed && styles.pressed]}>
            <X color={theme.textSecondary} size={22} />
          </Pressable>
        </View>
        <ProgressBar current={currentQuestionIndex + 1} total={quizQuestions.length} />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <QuestionCard
            bookmarkQuestionId={question.id}
            category={question.category}
            prompt={question.prompt}
          />

          <View style={styles.answerList}>
            {question.choices.map((choice, index) => (
              <AnswerButton
                disabled={Boolean(currentAnswer)}
                key={choice.id}
                label={choice.text}
                letter={answerLetters[index]}
                onPress={() => handleAnswer(choice.id)}
                selected={currentAnswer?.selectedAnswerId === choice.id}
                state={getAnswerState(choice)}
              />
            ))}
          </View>

          {currentAnswer && <AnswerFeedbackCard answer={currentAnswer} question={question} />}

          {currentAnswer && (
            <Pressable
              accessibilityRole="button"
              onPress={() => void handleContinue()}
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.continueButtonPressed,
              ]}>
              <ThemedText style={styles.continueText}>
                {isFinalQuestion ? 'Finish Quiz' : 'Next Question'}
              </ThemedText>
              <ArrowRight color={theme.textOnSolid} size={20} strokeWidth={2.5} />
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const useStyles = createThemedStyles((theme) => ({
  screen: { flex: 1 },
  safeArea: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  topBar: {
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressCopy: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  questionNumber: { flex: 1, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  progressPercent: { fontSize: 12, lineHeight: 18, fontWeight: '700' },
  exitButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  answerList: { gap: 10 },
  continueButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: theme.primarySolid,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonPressed: { backgroundColor: theme.primaryPressed, transform: [{ scale: 0.99 }] },
  continueText: { color: theme.textOnSolid, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  pressed: { opacity: 0.65 },
}));
