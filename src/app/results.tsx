import { router } from 'expo-router';
import { CheckCircle2, RotateCcw, Trophy, XCircle } from 'lucide-react-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StorageWarning } from '@/components/results/storage-warning';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { useAndroidBackHandler } from '@/hooks/use-android-back-handler';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useQuizStore } from '@/stores/quiz-store';
import { calculateQuizResult } from '@/utils/quiz';
import { getCorrectChoice, getSelectedChoice } from '@/utils/randomization';

export default function QuizResultsScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const quizQuestions = useQuizStore((state) => state.quizQuestions);
  const answers = useQuizStore((state) => state.answers);
  const isComplete = useQuizStore((state) => state.isComplete);
  const completionError = useQuizStore((state) => state.completionError);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const result = useMemo(
    () => calculateQuizResult(quizQuestions, answers),
    [answers, quizQuestions],
  );

  const handleNewQuiz = useCallback(() => {
    resetQuiz();
    router.replace('/');
    return true;
  }, [resetQuiz]);

  useAndroidBackHandler(handleNewQuiz);

  useEffect(() => {
    if (!isComplete || quizQuestions.length === 0) {
      router.replace('/');
    }
  }, [isComplete, quizQuestions.length]);

  if (!isComplete || quizQuestions.length === 0) {
    return <ThemedView style={styles.screen} />;
  }

  const resultMessage =
    result.percentage >= 90
      ? 'Excellent work!'
      : result.percentage >= 75
        ? 'You passed!'
        : 'Keep practicing!';

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.trophyBadge}>
              <Trophy color={theme.primary} size={30} strokeWidth={2.3} />
            </View>
            <ThemedText style={styles.eyebrow}>QUIZ COMPLETE</ThemedText>
            <ThemedText style={styles.title}>{resultMessage}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Review your score and revisit anything you missed.
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.scoreCard}>
            <View style={styles.scoreCircle}>
              <ThemedText style={styles.percentage}>{result.percentage}%</ThemedText>
              <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
            </View>
            <View style={styles.stats}>
              <View style={styles.statRow}>
                <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                  Total questions
                </ThemedText>
                <ThemedText style={styles.statValue}>{result.total}</ThemedText>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statLabelWithIcon}>
                  <CheckCircle2 color={theme.success} size={17} />
                  <ThemedText style={[styles.statLabel, styles.correctLabel]}>Correct</ThemedText>
                </View>
                <ThemedText style={[styles.statValue, styles.correctLabel]}>
                  {result.correct}
                </ThemedText>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statLabelWithIcon}>
                  <XCircle color={theme.error} size={17} />
                  <ThemedText style={[styles.statLabel, styles.incorrectLabel]}>Incorrect</ThemedText>
                </View>
                <ThemedText style={[styles.statValue, styles.incorrectLabel]}>
                  {result.incorrect}
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {completionError && <StorageWarning message={completionError} />}

          <View style={styles.reviewSection}>
            <View style={styles.reviewHeading}>
              <ThemedText style={styles.reviewTitle}>Questions to review</ThemedText>
              <View
                style={[
                  styles.reviewCountBadge,
                  result.incorrect === 0 && styles.reviewCountSuccess,
                ]}>
                <ThemedText
                  style={[
                    styles.reviewCountText,
                    result.incorrect === 0 && styles.reviewCountSuccessText,
                  ]}>
                  {result.incorrect}
                </ThemedText>
              </View>
            </View>

            {result.incorrectAnswers.length === 0 ? (
              <View style={styles.perfectCard}>
                <CheckCircle2 color={theme.success} size={27} />
                <View style={styles.perfectCopy}>
                  <ThemedText style={styles.perfectTitle}>Perfect score</ThemedText>
                  <ThemedText style={styles.perfectText}>You answered every question correctly.</ThemedText>
                </View>
              </View>
            ) : (
              <View style={styles.incorrectList}>
                {result.incorrectAnswers.map(({ question, answer }) => {
                  const selectedChoice = getSelectedChoice(question, answer.selectedAnswerId);
                  const correctChoice = getCorrectChoice(question);
                  return (
                  <ThemedView type="backgroundElement" key={question.id} style={styles.reviewCard}>
                    <View style={styles.reviewMeta}>
                      <ThemedText style={styles.questionReference}>
                        Question {question.id.slice(1)}
                      </ThemedText>
                      <ThemedText themeColor="textSecondary" style={styles.categoryReference}>
                        {question.category}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.questionPrompt}>{question.prompt}</ThemedText>
                    <View style={styles.answerReview}>
                      <ThemedText style={styles.yourAnswerLabel}>YOUR ANSWER</ThemedText>
                      <ThemedText style={styles.yourAnswerText}>
                        {selectedChoice?.text}
                      </ThemedText>
                    </View>
                    <View style={[styles.answerReview, styles.correctAnswerReview]}>
                      <ThemedText style={styles.correctAnswerLabel}>CORRECT ANSWER</ThemedText>
                      <ThemedText style={styles.correctAnswerText}>
                        {correctChoice?.text}
                      </ThemedText>
                    </View>
                    {question.source && (
                      <ThemedText themeColor="textSecondary" style={styles.source}>
                        {question.source}
                      </ThemedText>
                    )}
                  </ThemedView>
                  );
                })}
              </View>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleNewQuiz}
            style={({ pressed }) => [styles.newQuizButton, pressed && styles.newQuizButtonPressed]}>
            <RotateCcw color={theme.textOnSolid} size={19} strokeWidth={2.5} />
            <ThemedText style={styles.newQuizText}>Take Another Quiz</ThemedText>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const useStyles = createThemedStyles((theme) => ({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  hero: { alignItems: 'center', gap: 7, paddingVertical: 8 },
  trophyBadge: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  eyebrow: { color: theme.primary, fontSize: 11, lineHeight: 16, fontWeight: '800', letterSpacing: 1.1 },
  title: { fontSize: 28, lineHeight: 35, fontWeight: '800', textAlign: 'center' },
  subtitle: { maxWidth: 340, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  scoreCard: { borderRadius: 24, padding: Spacing.four, flexDirection: 'row', alignItems: 'center', gap: Spacing.four },
  scoreCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 9,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: { color: theme.primary, fontSize: 27, lineHeight: 32, fontWeight: '800' },
  scoreLabel: { color: theme.textSecondary, fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 1 },
  stats: { flex: 1, gap: 11 },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  statLabelWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statLabel: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  statValue: { fontSize: 17, lineHeight: 22, fontWeight: '800' },
  correctLabel: { color: theme.success },
  incorrectLabel: { color: theme.error },
  reviewSection: { gap: 12 },
  reviewHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewTitle: { flex: 1, fontSize: 18, lineHeight: 24, fontWeight: '800' },
  reviewCountBadge: { minWidth: 28, height: 28, borderRadius: 10, paddingHorizontal: 8, backgroundColor: theme.errorSoft, alignItems: 'center', justifyContent: 'center' },
  reviewCountSuccess: { backgroundColor: theme.successSoft },
  reviewCountText: { color: theme.error, fontSize: 12, fontWeight: '800' },
  reviewCountSuccessText: { color: theme.success },
  perfectCard: { borderRadius: 18, backgroundColor: theme.successSoft, padding: Spacing.three, flexDirection: 'row', alignItems: 'center', gap: 12 },
  perfectCopy: { flex: 1, gap: 2 },
  perfectTitle: { color: theme.success, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  perfectText: { color: theme.text, fontSize: 13, lineHeight: 19 },
  incorrectList: { gap: 12 },
  reviewCard: { borderRadius: 18, padding: Spacing.three, gap: 12 },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  questionReference: { flex: 1, color: theme.primary, fontSize: 12, lineHeight: 17, fontWeight: '800' },
  categoryReference: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  questionPrompt: { fontSize: 15, lineHeight: 22, fontWeight: '700' },
  answerReview: { borderRadius: 12, backgroundColor: theme.errorSoft, padding: 11, gap: 3 },
  correctAnswerReview: { backgroundColor: theme.successSoft },
  yourAnswerLabel: { color: theme.error, fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 0.7 },
  yourAnswerText: { color: theme.error, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  correctAnswerLabel: { color: theme.success, fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 0.7 },
  correctAnswerText: { color: theme.success, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  source: { fontSize: 11, lineHeight: 17, fontStyle: 'italic' },
  newQuizButton: { minHeight: 58, borderRadius: 18, backgroundColor: theme.primarySolid, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  newQuizButtonPressed: { backgroundColor: theme.primaryPressed, transform: [{ scale: 0.99 }] },
  newQuizText: { color: theme.textOnSolid, fontSize: 16, lineHeight: 22, fontWeight: '800' },
}));
