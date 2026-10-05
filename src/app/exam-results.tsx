import { router } from 'expo-router';
import {
  CheckCircle2,
  CircleDashed,
  Eye,
  Home,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StorageWarning } from '@/components/results/storage-warning';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { useAndroidBackHandler } from '@/hooks/use-android-back-handler';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMockExamStore } from '@/stores/mock-exam-store';
import {
  calculateMockExamResult,
  getMockExamPerformanceMessage,
} from '@/utils/mock-exam';

export default function ExamResultsScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const examQuestions = useMockExamStore((state) => state.examQuestions);
  const answers = useMockExamStore((state) => state.answers);
  const isSubmitted = useMockExamStore((state) => state.isSubmitted);
  const submissionError = useMockExamStore((state) => state.submissionError);
  const startMockExam = useMockExamStore((state) => state.startMockExam);
  const resetMockExam = useMockExamStore((state) => state.resetMockExam);
  const result = useMemo(
    () => (isSubmitted ? calculateMockExamResult(examQuestions, answers) : null),
    [answers, examQuestions, isSubmitted],
  );
  const performanceMessage = result
    ? getMockExamPerformanceMessage(result.percentage)
    : null;

  const handleHome = useCallback(() => {
    resetMockExam();
    router.replace('/');
    return true;
  }, [resetMockExam]);

  useAndroidBackHandler(handleHome);

  useEffect(() => {
    if (!isSubmitted || examQuestions.length === 0) {
      router.replace('/');
    }
  }, [examQuestions.length, isSubmitted]);

  if (!result || !performanceMessage) {
    return <ThemedView style={styles.screen} />;
  }

  const handleReview = () => router.push('/exam-review');

  const handleAnotherExam = () => {
    const questionCount = startMockExam();
    router.replace(questionCount > 0 ? '/mock-exam' : '/');
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.practiceBadge}>
              <ShieldCheck color={theme.primary} size={16} strokeWidth={2.5} />
              <ThemedText style={styles.practiceBadgeText}>MOCK / PRACTICE RESULT</ThemedText>
            </View>
            <ThemedText style={styles.title}>{performanceMessage.title}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {performanceMessage.description}
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.resultCard}>
            <ThemedText themeColor="textSecondary" style={styles.resultCardLabel}>
              YOUR PRACTICE RESULT
            </ThemedText>
            <View style={styles.mainMetrics}>
              <View style={styles.metric}>
                <ThemedText themeColor="textSecondary" style={styles.metricLabel}>
                  Score
                </ThemedText>
                <ThemedText style={styles.scoreValue}>
                  {result.score} <ThemedText style={styles.scoreTotal}>/ {result.total}</ThemedText>
                </ThemedText>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metric}>
                <ThemedText themeColor="textSecondary" style={styles.metricLabel}>
                  Percentage
                </ThemedText>
                <ThemedText style={styles.percentageValue}>{result.percentage}%</ThemedText>
              </View>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statsList}>
              <View style={styles.statRow}>
                <View style={[styles.statIcon, styles.correctIcon]}>
                  <CheckCircle2 color={theme.success} size={19} />
                </View>
                <ThemedText style={styles.statLabel}>Correct</ThemedText>
                <ThemedText style={[styles.statValue, styles.correctText]}>
                  {result.correct}
                </ThemedText>
              </View>
              <View style={styles.statRow}>
                <View style={[styles.statIcon, styles.incorrectIcon]}>
                  <XCircle color={theme.error} size={19} />
                </View>
                <ThemedText style={styles.statLabel}>Incorrect</ThemedText>
                <ThemedText style={[styles.statValue, styles.incorrectText]}>
                  {result.incorrect}
                </ThemedText>
              </View>
              <View style={styles.statRow}>
                <View style={[styles.statIcon, styles.unansweredIcon]}>
                  <CircleDashed color={theme.warning} size={19} />
                </View>
                <ThemedText style={styles.statLabel}>Unanswered</ThemedText>
                <ThemedText style={[styles.statValue, styles.unansweredText]}>
                  {result.unanswered}
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {submissionError && <StorageWarning message={submissionError} />}

          <View style={styles.disclaimer}>
            <ThemedText style={styles.disclaimerTitle}>Practice result only</ThemedText>
            <ThemedText style={styles.disclaimerText}>
              This score is from an in-app mock exam. It is not an official LTO examination result
              or certification.
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleReview}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}>
              <Eye color={theme.textOnSolid} size={19} strokeWidth={2.5} />
              <ThemedText style={styles.primaryButtonText}>Review Answers</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleAnotherExam}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}>
              <RotateCcw color={theme.primary} size={19} strokeWidth={2.5} />
              <ThemedText style={styles.secondaryButtonText}>Take Another Exam</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleHome}
              style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}>
              <Home color={theme.textSecondary} size={18} strokeWidth={2.5} />
              <ThemedText themeColor="textSecondary" style={styles.homeButtonText}>
                Back to Home
              </ThemedText>
            </Pressable>
          </View>
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
  hero: { alignItems: 'center', gap: 8, paddingVertical: 6 },
  practiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: theme.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  practiceBadgeText: {
    color: theme.primary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  title: {
    maxWidth: 360,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: { maxWidth: 360, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  resultCard: { borderRadius: 24, padding: Spacing.four, gap: 16 },
  resultCardLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  mainMetrics: { flexDirection: 'row', alignItems: 'stretch' },
  metric: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  metricDivider: { width: StyleSheet.hairlineWidth, backgroundColor: theme.border },
  metricLabel: { fontSize: 13, lineHeight: 19, fontWeight: '700' },
  scoreValue: { color: theme.primary, fontSize: 35, lineHeight: 42, fontWeight: '800' },
  scoreTotal: { color: theme.textSecondary, fontSize: 20, lineHeight: 27, fontWeight: '700' },
  percentageValue: {
    color: theme.primary,
    fontSize: 35,
    lineHeight: 42,
    fontWeight: '800',
  },
  statsDivider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.border },
  statsList: { gap: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctIcon: { backgroundColor: theme.successSoft },
  incorrectIcon: { backgroundColor: theme.errorSoft },
  unansweredIcon: { backgroundColor: theme.warningSoft },
  statLabel: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  statValue: { fontSize: 20, lineHeight: 26, fontWeight: '800' },
  correctText: { color: theme.success },
  incorrectText: { color: theme.error },
  unansweredText: { color: theme.warning },
  disclaimer: {
    borderRadius: 16,
    backgroundColor: theme.warningSoft,
    padding: Spacing.three,
    gap: 4,
  },
  disclaimerTitle: {
    color: theme.warning,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  disclaimerText: { color: theme.text, fontSize: 12, lineHeight: 18 },
  actions: { gap: 10 },
  primaryButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: theme.primarySolid,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  primaryButtonPressed: {
    backgroundColor: theme.primaryPressed,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: theme.textOnSolid,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.primary,
    backgroundColor: theme.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  secondaryButtonPressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  secondaryButtonText: {
    color: theme.primary,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '800',
  },
  homeButton: {
    minHeight: 48,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  homeButtonPressed: { opacity: 0.58 },
  homeButtonText: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
}));
