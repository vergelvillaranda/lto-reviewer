import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Send, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestionNavigator } from '@/components/exam/question-navigator';
import { AnswerButton } from '@/components/quiz/answer-button';
import { ProgressBar } from '@/components/quiz/progress-bar';
import { QuestionCard } from '@/components/quiz/question-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { useAndroidBackHandler } from '@/hooks/use-android-back-handler';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMockExamStore } from '@/stores/mock-exam-store';

const answerLetters = ['A', 'B', 'C', 'D'] as const;

export default function MockExamScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const scrollRef = useRef<ScrollView>(null);
  const examQuestions = useMockExamStore((state) => state.examQuestions);
  const currentQuestionIndex = useMockExamStore((state) => state.currentQuestionIndex);
  const answers = useMockExamStore((state) => state.answers);
  const selectAnswer = useMockExamStore((state) => state.selectAnswer);
  const goToQuestion = useMockExamStore((state) => state.goToQuestion);
  const nextQuestion = useMockExamStore((state) => state.nextQuestion);
  const previousQuestion = useMockExamStore((state) => state.previousQuestion);
  const submitExam = useMockExamStore((state) => state.submitExam);
  const resetMockExam = useMockExamStore((state) => state.resetMockExam);
  const question = examQuestions[currentQuestionIndex];
  const currentAnswer = question
    ? answers.find((answer) => answer.questionId === question.id)
    : undefined;
  const answeredQuestionIds = useMemo(
    () => new Set(answers.map((answer) => answer.questionId)),
    [answers],
  );
  const isFirstQuestion = currentQuestionIndex === 0;
  const isFinalQuestion = currentQuestionIndex === examQuestions.length - 1;

  const confirmExit = useCallback(() => {
    Alert.alert('Exit Mock Exam?', 'Your current exam answers will be discarded.', [
      { text: 'Continue Exam', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => {
          resetMockExam();
          router.replace('/');
        },
      },
    ]);
  }, [resetMockExam]);

  const handleHardwareBack = useCallback(() => {
    confirmExit();
    return true;
  }, [confirmExit]);

  useAndroidBackHandler(handleHardwareBack);

  useEffect(() => {
    if (examQuestions.length === 0) {
      router.replace('/');
    }
  }, [examQuestions.length]);

  if (!question) {
    return <ThemedView style={styles.screen} />;
  }

  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

  const handleGoToQuestion = (index: number) => {
    goToQuestion(index);
    scrollToTop();
  };

  const handlePrevious = () => {
    previousQuestion();
    scrollToTop();
  };

  const handleNext = () => {
    nextQuestion();
    scrollToTop();
  };

  const completeSubmission = async () => {
    await submitExam();
    router.replace('/exam-results');
  };

  const confirmSubmit = () => {
    const unanswered = examQuestions.length - answers.length;
    const message =
      unanswered > 0
        ? `You still have ${unanswered} unanswered ${unanswered === 1 ? 'question' : 'questions'}. Submit anyway?`
        : 'You have answered every question. Submit your exam now?';

    Alert.alert('Submit Exam', message, [
      { text: 'Keep Reviewing', style: 'cancel' },
      { text: 'Submit Exam', onPress: () => void completeSubmission() },
    ]);
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}>
          <View style={styles.progressCopy}>
            <ThemedText style={styles.examLabel}>LTO MOCK EXAM</ThemedText>
            <ThemedText style={styles.questionNumber}>
              Question {currentQuestionIndex + 1} of {examQuestions.length}
            </ThemedText>
          </View>
          <Pressable
            accessibilityLabel="Exit mock exam"
            accessibilityRole="button"
            hitSlop={10}
            onPress={confirmExit}
            style={({ pressed }) => [styles.exitButton, pressed && styles.pressed]}>
            <X color={theme.textSecondary} size={22} />
          </Pressable>
        </View>
        <ProgressBar current={currentQuestionIndex + 1} total={examQuestions.length} />

        <View style={styles.navigatorHeader}>
          <ThemedText themeColor="textSecondary" style={styles.navigatorHint}>
            Jump to a question
          </ThemedText>
          <ThemedText style={styles.answeredCount}>
            {answers.length}/{examQuestions.length} answered
          </ThemedText>
        </View>
        <QuestionNavigator
          answeredQuestionIds={answeredQuestionIds}
          currentIndex={currentQuestionIndex}
          onSelect={handleGoToQuestion}
          questionIds={examQuestions.map((examQuestion) => examQuestion.id)}
        />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <QuestionCard category={question.category} prompt={question.prompt} />

          <View style={styles.answerList}>
            {question.choices.map((choice, index) => {
              const selected = currentAnswer?.selectedAnswerId === choice.id;
              return (
                <AnswerButton
                  disabled={false}
                  key={choice.id}
                  label={choice.text}
                  letter={answerLetters[index]}
                  onPress={() => selectAnswer(choice.id)}
                  selected={selected}
                  state={selected ? 'selected' : 'default'}
                />
              );
            })}
          </View>

          <ThemedText themeColor="textSecondary" style={styles.answerHint}>
            Your answer is saved automatically and can be changed before submission.
          </ThemedText>

          <View style={styles.navigationButtons}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isFirstQuestion }}
              disabled={isFirstQuestion}
              onPress={handlePrevious}
              style={({ pressed }) => [
                styles.previousButton,
                isFirstQuestion && styles.disabledButton,
                pressed && !isFirstQuestion && styles.pressed,
              ]}>
              <ArrowLeft color={theme.primary} size={19} strokeWidth={2.5} />
              <ThemedText style={styles.previousText}>Previous</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={isFinalQuestion ? confirmSubmit : handleNext}
              style={({ pressed }) => [
                styles.nextButton,
                pressed && styles.nextButtonPressed,
              ]}>
              <ThemedText style={styles.nextText}>
                {isFinalQuestion ? 'Submit Exam' : 'Next'}
              </ThemedText>
              {isFinalQuestion ? (
                <Send color={theme.textOnSolid} size={18} strokeWidth={2.5} />
              ) : (
                <ArrowRight color={theme.textOnSolid} size={19} strokeWidth={2.5} />
              )}
            </Pressable>
          </View>
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
  progressCopy: { flex: 1, gap: 1 },
  examLabel: {
    color: theme.primary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  questionNumber: { fontSize: 16, lineHeight: 22, fontWeight: '800' },
  exitButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigatorHeader: {
    paddingHorizontal: Spacing.three,
    paddingTop: 14,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigatorHint: { flex: 1, fontSize: 12, lineHeight: 18 },
  answeredCount: { color: theme.primary, fontSize: 12, lineHeight: 18, fontWeight: '800' },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  answerList: { gap: 10 },
  answerHint: { textAlign: 'center', fontSize: 12, lineHeight: 18 },
  navigationButtons: { flexDirection: 'row', gap: 10 },
  previousButton: {
    flex: 1,
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: theme.primary,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  previousText: { color: theme.primary, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  nextButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: theme.primarySolid,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  nextButtonPressed: { backgroundColor: theme.primaryPressed, transform: [{ scale: 0.99 }] },
  nextText: { color: theme.textOnSolid, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  disabledButton: { opacity: 0.35 },
  pressed: { opacity: 0.68 },
}));
