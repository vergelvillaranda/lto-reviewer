import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, CircleDashed, XCircle } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExamReviewCard } from '@/components/exam/exam-review-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { questions } from '@/data/questions';
import { useExamHistoryStore } from '@/stores/exam-history-store';
import { formatExamHistoryDate, formatExamHistoryTime } from '@/utils/exam-history';
import { createHistoricalMockExamReviewItems } from '@/utils/mock-exam-review';

export default function HistoryDetailScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const historyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const records = useExamHistoryStore((state) => state.records);
  const hasLoaded = useExamHistoryStore((state) => state.hasLoaded);
  const isLoading = useExamHistoryStore((state) => state.isLoading);
  const loadHistory = useExamHistoryStore((state) => state.loadHistory);
  const record = records.find((item) => item.id === historyId);

  useEffect(() => {
    if (!hasLoaded) {
      void loadHistory();
    }
  }, [hasLoaded, loadHistory]);

  const reviewItems = useMemo(() => {
    if (!record) {
      return [];
    }

    return createHistoricalMockExamReviewItems(questions, record);
  }, [record]);

  if (!hasLoaded || isLoading) {
    return (
      <ThemedView style={styles.screen}>
        <View style={styles.loadingState}>
          <ActivityIndicator color={theme.primary} size="large" />
        </View>
      </ThemedView>
    );
  }

  if (!record) {
    return (
      <ThemedView style={styles.screen}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to exam history"
              accessibilityRole="button"
              onPress={() => router.replace('/history')}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <ArrowLeft color={theme.primary} size={22} strokeWidth={2.5} />
            </Pressable>
            <ThemedText style={styles.title}>Attempt Details</ThemedText>
          </View>
          <View style={styles.notFoundState}>
            <ThemedText style={styles.notFoundTitle}>Attempt not available</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.notFoundText}>
              This saved exam could not be found or is no longer readable.
            </ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const missingQuestionCount = record.questionIds.length - reviewItems.length;

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to exam history"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <ArrowLeft color={theme.primary} size={22} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerCopy}>
            <ThemedText style={styles.eyebrow}>SAVED MOCK EXAM</ThemedText>
            <ThemedText style={styles.title}>Attempt Details</ThemedText>
          </View>
        </View>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={reviewItems}
          initialNumToRender={7}
          keyExtractor={(item) => item.question.id}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <ThemedView type="backgroundElement" style={styles.summaryCard}>
                <View style={styles.summaryHeading}>
                  <View style={styles.summaryDate}>
                    <ThemedText style={styles.date}>{formatExamHistoryDate(record.completedAt)}</ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.time}>
                      {formatExamHistoryTime(record.completedAt)}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.percentage}>{record.percentage}%</ThemedText>
                </View>
                <ThemedText style={styles.score}>
                  {record.score} <ThemedText style={styles.scoreTotal}>/ {record.totalQuestions}</ThemedText>
                </ThemedText>
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <CheckCircle2 color={theme.success} size={17} />
                    <ThemedText style={styles.statText}>Correct {record.correct}</ThemedText>
                  </View>
                  <View style={styles.stat}>
                    <XCircle color={theme.error} size={17} />
                    <ThemedText style={styles.statText}>Incorrect {record.incorrect}</ThemedText>
                  </View>
                  <View style={styles.stat}>
                    <CircleDashed color={theme.warning} size={17} />
                    <ThemedText style={styles.statText}>Unanswered {record.unanswered}</ThemedText>
                  </View>
                </View>
              </ThemedView>

              <View style={styles.reviewHeading}>
                <ThemedText style={styles.reviewTitle}>Answer Review</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.reviewCount}>
                  {reviewItems.length} questions
                </ThemedText>
              </View>

              {missingQuestionCount > 0 && (
                <View style={styles.warningCard}>
                  <ThemedText style={styles.warningText}>
                    {missingQuestionCount} saved {missingQuestionCount === 1 ? 'question is' : 'questions are'} no longer available in the local question bank.
                  </ThemedText>
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <ExamReviewCard
              answer={item.answer}
              question={item.question}
              questionNumber={item.questionNumber}
              status={item.status}
            />
          )}
          showsVerticalScrollIndicator={false}
          windowSize={7}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const useStyles = createThemedStyles((theme) => ({
  screen: { flex: 1 },
  safeArea: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1 },
  eyebrow: { color: theme.primary, fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 0.8 },
  title: { fontSize: 23, lineHeight: 30, fontWeight: '800' },
  listContent: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.five, gap: 12 },
  listHeader: { gap: 14, marginBottom: 2 },
  summaryCard: { borderRadius: 22, padding: Spacing.three, gap: 12 },
  summaryHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryDate: { flex: 1 },
  date: { fontSize: 15, lineHeight: 21, fontWeight: '800' },
  time: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  percentage: { color: theme.primary, fontSize: 23, lineHeight: 30, fontWeight: '800' },
  score: { color: theme.primary, fontSize: 32, lineHeight: 39, fontWeight: '800' },
  scoreTotal: { color: theme.textSecondary, fontSize: 18, lineHeight: 25, fontWeight: '700' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { fontSize: 11, lineHeight: 16, fontWeight: '700' },
  reviewHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewTitle: { flex: 1, fontSize: 17, lineHeight: 24, fontWeight: '800' },
  reviewCount: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  warningCard: { borderRadius: 14, backgroundColor: theme.warningSoft, padding: 12 },
  warningText: { color: theme.warning, fontSize: 12, lineHeight: 18, fontWeight: '600' },
  notFoundState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four, gap: 5 },
  notFoundTitle: { fontSize: 19, lineHeight: 26, fontWeight: '800', textAlign: 'center' },
  notFoundText: { maxWidth: 320, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  pressed: { opacity: 0.65 },
}));
