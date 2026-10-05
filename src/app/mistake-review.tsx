import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, CheckCircle2, RefreshCw, Target, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerButton, type AnswerButtonState } from '@/components/quiz/answer-button';
import { AnswerFeedbackCard } from '@/components/quiz/answer-feedback-card';
import { ProgressBar } from '@/components/quiz/progress-bar';
import { QuestionCard } from '@/components/quiz/question-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { questions } from '@/data/questions';
import { useHapticPreferenceStore } from '@/stores/haptic-preference-store';
import { useMistakeTrackingStore } from '@/stores/mistake-tracking-store';
import { MISTAKE_MASTERY_CORRECT_STREAK } from '@/types/mistake-tracking';
import type { AnswerId, QuizAnswer, QuizSessionChoice, QuizSessionQuestion } from '@/types/quiz';
import { createMistakeReviewQuestions } from '@/utils/mistake-tracking';
import { createSessionQuestion } from '@/utils/randomization';

const answerLetters = ['A', 'B', 'C', 'D'] as const;

export default function MistakeReviewScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const scrollRef = useRef<ScrollView>(null);
  const initialized = useRef(false);
  const isHapticFeedbackEnabled = useHapticPreferenceStore(
    (state) => state.hasLoaded && state.isEnabled,
  );
  const records = useMistakeTrackingStore((state) => state.records);
  const isLoading = useMistakeTrackingStore((state) => state.isLoading);
  const hasLoaded = useMistakeTrackingStore((state) => state.hasLoaded);
  const errorMessage = useMistakeTrackingStore((state) => state.errorMessage);
  const loadRecords = useMistakeTrackingStore((state) => state.loadRecords);
  const recordOutcome = useMistakeTrackingStore((state) => state.recordOutcome);
  const [reviewQuestions, setReviewQuestions] = useState<QuizSessionQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      void loadRecords();
    }
  }, [hasLoaded, loadRecords]);

  useEffect(() => {
    if (hasLoaded && !initialized.current) {
      setReviewQuestions(
        createMistakeReviewQuestions(questions, records).map((question) =>
          createSessionQuestion(question),
        ),
      );
      initialized.current = true;
      setIsSessionReady(true);
    }
  }, [hasLoaded, records]);

  const question = reviewQuestions[currentQuestionIndex];
  const currentAnswer = question
    ? answers.find((answer) => answer.questionId === question.id)
    : undefined;
  const isFinalQuestion = currentQuestionIndex === reviewQuestions.length - 1;
  const correctCount = useMemo(
    () => answers.filter((answer) => answer.isCorrect).length,
    [answers],
  );

  const handleAnswer = (answerId: AnswerId) => {
    if (!question || currentAnswer) {
      return;
    }

    const selectedChoice = question.choices.find((choice) => choice.id === answerId);
    if (!selectedChoice) {
      return;
    }
    const isCorrect = selectedChoice.isCorrect;
    const answer: QuizAnswer = {
      questionId: question.id,
      selectedAnswerId: answerId,
      isCorrect,
    };
    setAnswers((currentAnswers) => [...currentAnswers, answer]);
    void recordOutcome({ questionId: question.id, isCorrect });
    if (isHapticFeedbackEnabled) {
      void Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      ).catch(() => undefined);
    }
  };

  const handleContinue = () => {
    if (isFinalQuestion) {
      setIsComplete(true);
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const getAnswerState = (choice: QuizSessionChoice): AnswerButtonState => {
    if (!currentAnswer || !question) {
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

  if (!hasLoaded || isLoading || !isSessionReady) {
    return (
      <ThemedView style={styles.screen}>
        <View style={styles.centeredState}>
          <ActivityIndicator color={theme.primary} size="large" />
          <ThemedText themeColor="textSecondary" style={styles.stateText}>
            Loading mistakes…
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (reviewQuestions.length === 0) {
    return (
      <ThemedView style={styles.screen}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to home"
              accessibilityRole="button"
              onPress={() => router.replace('/')}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <ArrowLeft color={theme.primary} size={22} strokeWidth={2.5} />
            </Pressable>
            <ThemedText style={styles.headerTitle}>Review Mistakes</ThemedText>
          </View>
          <View style={styles.centeredState}>
            <View style={styles.emptyIcon}>
              {errorMessage ? (
                <RefreshCw color={theme.error} size={30} />
              ) : (
                <CheckCircle2 color={theme.success} size={32} />
              )}
            </View>
            <ThemedText style={styles.emptyTitle}>
              {errorMessage ? 'Progress unavailable' : 'No questions need review'}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              {errorMessage
                ? errorMessage
                : 'Questions you miss in quizzes and mock exams will appear here.'}
            </ThemedText>
            {errorMessage && (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  initialized.current = false;
                  setIsSessionReady(false);
                  void loadRecords();
                }}
                style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
                <RefreshCw color={theme.primary} size={17} />
                <ThemedText style={styles.outlineButtonText}>Try Again</ThemedText>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (isComplete) {
    return (
      <ThemedView style={styles.screen}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.completionContent}>
            <View style={styles.completeIcon}>
              <Target color={theme.primary} size={34} strokeWidth={2.3} />
            </View>
            <ThemedText style={styles.completeEyebrow}>MISTAKE REVIEW COMPLETE</ThemedText>
            <ThemedText style={styles.completeTitle}>Focused practice finished</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.completeText}>
              You answered {correctCount} of {reviewQuestions.length} correctly. A question is
              marked mastered after {MISTAKE_MASTERY_CORRECT_STREAK} correct answers in a row.
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/')}
              style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}>
              <ThemedText style={styles.homeButtonText}>Back to Home</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!question) {
    return <ThemedView style={styles.screen} />;
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}>
          <View style={styles.progressCopy}>
            <ThemedText style={styles.eyebrow}>REVIEW MISTAKES</ThemedText>
            <ThemedText style={styles.questionNumber}>
              Question {currentQuestionIndex + 1} of {reviewQuestions.length}
            </ThemedText>
          </View>
          <Pressable
            accessibilityLabel="Exit mistake review"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.exitButton, pressed && styles.pressed]}>
            <X color={theme.textSecondary} size={22} />
          </Pressable>
        </View>
        <ProgressBar current={currentQuestionIndex + 1} total={reviewQuestions.length} />

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

          {currentAnswer && (
            <AnswerFeedbackCard
              answer={currentAnswer}
              question={question}
              showCorrectAnswerWhenCorrect
            />
          )}

          {currentAnswer && (
            <Pressable
              accessibilityRole="button"
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.continueButtonPressed,
              ]}>
              <ThemedText style={styles.continueText}>
                {isFinalQuestion ? 'Finish Review' : 'Next Question'}
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
  header: { paddingHorizontal: Spacing.three, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 23, lineHeight: 30, fontWeight: '800' },
  topBar: { paddingHorizontal: Spacing.three, paddingTop: 12, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressCopy: { flex: 1, gap: 1 },
  eyebrow: { color: theme.primary, fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 0.9 },
  questionNumber: { fontSize: 16, lineHeight: 22, fontWeight: '800' },
  exitButton: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: Spacing.three, paddingTop: Spacing.four, paddingBottom: Spacing.five, gap: Spacing.four },
  answerList: { gap: 10 },
  continueButton: { minHeight: 58, borderRadius: 18, backgroundColor: theme.primarySolid, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  continueButtonPressed: { backgroundColor: theme.primaryPressed, transform: [{ scale: 0.99 }] },
  continueText: { color: theme.textOnSolid, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four, gap: 7 },
  stateText: { fontSize: 13, lineHeight: 19 },
  emptyIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 20, lineHeight: 27, fontWeight: '800', textAlign: 'center' },
  emptyText: { maxWidth: 320, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  outlineButton: { marginTop: 12, minHeight: 46, borderWidth: 1.5, borderColor: theme.primary, borderRadius: 15, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  outlineButtonText: { color: theme.primary, fontSize: 13, lineHeight: 19, fontWeight: '800' },
  completionContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four, gap: 8 },
  completeIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  completeEyebrow: { color: theme.primary, fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 0.9 },
  completeTitle: { fontSize: 25, lineHeight: 32, fontWeight: '800', textAlign: 'center' },
  completeText: { maxWidth: 360, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  homeButton: { marginTop: 16, minHeight: 52, minWidth: 200, borderRadius: 17, backgroundColor: theme.primarySolid, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  homeButtonPressed: { backgroundColor: theme.primaryPressed },
  homeButtonText: { color: theme.textOnSolid, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  pressed: { opacity: 0.65 },
}));
