import { router } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  RefreshCw,
  Target,
  Trophy,
} from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPerformanceCard } from '@/components/statistics/category-performance-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { questions } from '@/data/questions';
import { useExamHistoryStore } from '@/stores/exam-history-store';
import { useQuizPerformanceStore } from '@/stores/quiz-performance-store';
import { calculatePerformanceStatistics } from '@/utils/performance';

function formatPercentage(value: number | null): string {
  return value === null ? '—' : `${value}%`;
}

export default function StatisticsScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const examHistory = useExamHistoryStore((state) => state.records);
  const examHistoryLoading = useExamHistoryStore((state) => state.isLoading);
  const examHistoryLoaded = useExamHistoryStore((state) => state.hasLoaded);
  const examHistoryError = useExamHistoryStore((state) => state.errorMessage);
  const loadExamHistory = useExamHistoryStore((state) => state.loadHistory);
  const quizAttempts = useQuizPerformanceStore((state) => state.attempts);
  const quizAttemptsLoading = useQuizPerformanceStore((state) => state.isLoading);
  const quizAttemptsLoaded = useQuizPerformanceStore((state) => state.hasLoaded);
  const quizAttemptsError = useQuizPerformanceStore((state) => state.errorMessage);
  const loadQuizAttempts = useQuizPerformanceStore((state) => state.loadAttempts);
  const statistics = useMemo(
    () => calculatePerformanceStatistics(questions, examHistory, quizAttempts),
    [examHistory, quizAttempts],
  );
  const isLoading =
    examHistoryLoading ||
    quizAttemptsLoading ||
    !examHistoryLoaded ||
    !quizAttemptsLoaded;
  const storageError = examHistoryError ?? quizAttemptsError;

  useEffect(() => {
    void Promise.all([loadExamHistory(), loadQuizAttempts()]);
  }, [loadExamHistory, loadQuizAttempts]);

  const retryLoading = () => {
    void Promise.all([loadExamHistory(), loadQuizAttempts()]);
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to home"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <ArrowLeft color={theme.primary} size={22} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerCopy}>
            <ThemedText style={styles.eyebrow}>YOUR LOCAL PROGRESS</ThemedText>
            <ThemedText style={styles.title}>Statistics</ThemedText>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={theme.primary} size="large" />
            <ThemedText themeColor="textSecondary" style={styles.loadingText}>
              Calculating performance…
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {storageError && (
              <View style={styles.errorCard}>
                <AlertCircle color={theme.error} size={20} />
                <View style={styles.errorCopy}>
                  <ThemedText style={styles.errorTitle}>Some data could not be loaded</ThemedText>
                  <ThemedText style={styles.errorText}>{storageError}</ThemedText>
                </View>
                <Pressable
                  accessibilityLabel="Retry loading statistics"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={retryLoading}>
                  <RefreshCw color={theme.error} size={19} />
                </Pressable>
              </View>
            )}

            <View style={styles.sectionHeading}>
              <ThemedText style={styles.sectionTitle}>Overall</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.sectionHint}>
                Offline data only
              </ThemedText>
            </View>

            <View style={styles.metricGrid}>
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <BookOpenCheck color={theme.primary} size={20} />
                <ThemedText style={styles.metricValue}>{statistics.examsTaken}</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.metricLabel}>
                  Exams Taken
                </ThemedText>
              </ThemedView>
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <BarChart3 color={theme.primary} size={20} />
                <ThemedText style={styles.metricValue}>
                  {formatPercentage(statistics.averageScore)}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.metricLabel}>
                  Average Score
                </ThemedText>
              </ThemedView>
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <Trophy color={theme.warning} size={20} />
                <ThemedText style={styles.metricValue}>
                  {formatPercentage(statistics.bestScore)}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.metricLabel}>
                  Best Score
                </ThemedText>
              </ThemedView>
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <Target color={theme.success} size={20} />
                <ThemedText style={styles.metricValue}>
                  {statistics.totalQuestionsAnswered}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.metricLabel}>
                  Questions Answered
                </ThemedText>
              </ThemedView>
            </View>

            <View style={styles.accuracyCard}>
              <View style={styles.accuracyCopy}>
                <ThemedText style={styles.accuracyLabel}>Overall Accuracy</ThemedText>
                <ThemedText style={styles.accuracyValue}>
                  {formatPercentage(statistics.overallAccuracy)}
                </ThemedText>
              </View>
              <View style={styles.accuracyCounts}>
                <ThemedText style={styles.correctCount}>
                  {statistics.totalCorrect} correct
                </ThemedText>
                <ThemedText style={styles.incorrectCount}>
                  {statistics.totalIncorrect} incorrect
                </ThemedText>
              </View>
            </View>

            {statistics.totalQuestionsAnswered === 0 && (
              <View style={styles.noDataCard}>
                <ThemedText style={styles.noDataTitle}>Not enough data yet</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.noDataText}>
                  Complete a quiz or submit a mock exam to begin building your performance profile.
                </ThemedText>
              </View>
            )}

            <View style={styles.sectionHeading}>
              <ThemedText style={styles.sectionTitle}>Category Performance</ThemedText>
            </View>

            <View style={styles.categoryList}>
              {statistics.categories.map((category) => (
                <CategoryPerformanceCard key={category.category} performance={category} />
              ))}
            </View>

            <View
              style={[
                styles.weakestCard,
                !statistics.weakestCategory && styles.weakestCardEmpty,
              ]}>
              <Target
                color={statistics.weakestCategory ? theme.warning : theme.textSecondary}
                size={23}
              />
              <View style={styles.weakestCopy}>
                <ThemedText style={styles.weakestLabel}>NEEDS MORE PRACTICE</ThemedText>
                <ThemedText style={styles.weakestValue}>
                  {statistics.weakestCategory?.category ?? 'Not enough data yet'}
                </ThemedText>
                {statistics.weakestCategory && (
                  <ThemedText themeColor="textSecondary" style={styles.weakestDetail}>
                    {statistics.weakestCategory.accuracy}% accuracy across{' '}
                    {statistics.weakestCategory.questionsAnswered} answered
                  </ThemedText>
                )}
              </View>
            </View>

            <ThemedText themeColor="textSecondary" style={styles.dataNote}>
              Exam scores use submitted Mock Exam history. Category and accuracy totals also include
              completed quizzes saved from this version onward. Earlier quiz attempts were not
              stored and are not estimated.
            </ThemedText>
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const useStyles = createThemedStyles((theme) => ({
  screen: { flex: 1 },
  safeArea: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: { paddingHorizontal: Spacing.three, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1 },
  eyebrow: { color: theme.primary, fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 0.8 },
  title: { fontSize: 23, lineHeight: 30, fontWeight: '800' },
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13, lineHeight: 19 },
  scrollContent: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.five, gap: Spacing.three },
  errorCard: { borderRadius: 16, backgroundColor: theme.errorSoft, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  errorCopy: { flex: 1, gap: 2 },
  errorTitle: { color: theme.error, fontSize: 13, lineHeight: 19, fontWeight: '800' },
  errorText: { color: theme.error, fontSize: 11, lineHeight: 16 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  sectionTitle: { flex: 1, fontSize: 18, lineHeight: 25, fontWeight: '800' },
  sectionHint: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '48%', minHeight: 122, borderRadius: 18, padding: Spacing.three, gap: 5 },
  metricValue: { marginTop: 3, color: theme.primary, fontSize: 25, lineHeight: 31, fontWeight: '800' },
  metricLabel: { fontSize: 11, lineHeight: 16, fontWeight: '700' },
  accuracyCard: { borderRadius: 20, backgroundColor: theme.primarySoft, borderWidth: 1, borderColor: theme.primarySoftBorder, padding: Spacing.three, gap: 10 },
  accuracyCopy: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accuracyLabel: { flex: 1, color: theme.text, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  accuracyValue: { color: theme.primary, fontSize: 27, lineHeight: 33, fontWeight: '800' },
  accuracyCounts: { flexDirection: 'row', gap: 14 },
  correctCount: { color: theme.success, fontSize: 11, lineHeight: 16, fontWeight: '800' },
  incorrectCount: { color: theme.error, fontSize: 11, lineHeight: 16, fontWeight: '800' },
  noDataCard: { borderRadius: 16, backgroundColor: theme.warningSoft, padding: Spacing.three, gap: 4 },
  noDataTitle: { color: theme.warning, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  noDataText: { fontSize: 12, lineHeight: 18 },
  categoryList: { gap: 10 },
  weakestCard: { borderRadius: 18, backgroundColor: theme.warningSoft, borderWidth: 1, borderColor: theme.warningSoftBorder, padding: Spacing.three, flexDirection: 'row', alignItems: 'center', gap: 11 },
  weakestCardEmpty: { backgroundColor: theme.primarySoft, borderColor: theme.primarySoftBorder },
  weakestCopy: { flex: 1, gap: 2 },
  weakestLabel: { color: theme.warning, fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 0.7 },
  weakestValue: { color: theme.text, fontSize: 17, lineHeight: 23, fontWeight: '800' },
  weakestDetail: { fontSize: 11, lineHeight: 16 },
  dataNote: { paddingHorizontal: 4, fontSize: 10, lineHeight: 16, textAlign: 'center' },
  pressed: { opacity: 0.65 },
}));
