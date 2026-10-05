import { router } from 'expo-router';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BookOpenCheck,
  Bookmark,
  ChevronRight,
  ClipboardCheck,
  History,
  Settings,
  Target,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { questions } from '@/data/questions';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { useExamHistoryStore } from '@/stores/exam-history-store';
import { useMistakeTrackingStore } from '@/stores/mistake-tracking-store';
import { useMockExamStore } from '@/stores/mock-exam-store';
import { MOCK_EXAM_QUESTION_COUNT } from '@/types/mock-exam';
import { formatExamHistoryDate } from '@/utils/exam-history';
import { createMistakeReviewQuestions } from '@/utils/mistake-tracking';

interface QuickActionCardProps {
  accessibilityLabel: string;
  icon: ReactNode;
  onPress: () => void;
  subtitle: string;
  title: string;
}

function QuickActionCard({
  accessibilityLabel,
  icon,
  onPress,
  subtitle,
  title,
}: QuickActionCardProps) {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickCard,
        { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.quickIcon}>{icon}</View>
      <View style={styles.quickCopy}>
        <ThemedText style={styles.quickTitle}>{title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.quickSubtitle}>
          {subtitle}
        </ThemedText>
      </View>
      <ChevronRight
        color={theme.textSecondary}
        size={18}
        strokeWidth={2.4}
        style={styles.quickChevron}
      />
    </Pressable>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const bookmarkedQuestionIds = useBookmarkStore((state) => state.questionIds);
  const examHistory = useExamHistoryStore((state) => state.records);
  const loadExamHistory = useExamHistoryStore((state) => state.loadHistory);
  const mistakeRecords = useMistakeTrackingStore((state) => state.records);
  const loadMistakeRecords = useMistakeTrackingStore((state) => state.loadRecords);
  const startMockExam = useMockExamStore((state) => state.startMockExam);
  const availableQuestionIds = new Set(questions.map((question) => question.id));
  const bookmarkCount = bookmarkedQuestionIds.filter((questionId) =>
    availableQuestionIds.has(questionId),
  ).length;
  const mistakeReviewCount = createMistakeReviewQuestions(questions, mistakeRecords).length;
  const lastExam = examHistory[0];

  useEffect(() => {
    void Promise.all([loadExamHistory(), loadMistakeRecords()]);
  }, [loadExamHistory, loadMistakeRecords]);

  const openMockExam = () => router.push('/mock-exam');

  const handleStartMockExam = () => {
    const examQuestionCount = startMockExam();
    if (examQuestionCount === 0) {
      Alert.alert('Mock Exam Unavailable', 'No questions are currently available.');
      return;
    }
    if (examQuestionCount < MOCK_EXAM_QUESTION_COUNT) {
      Alert.alert(
        'Limited Question Bank',
        `Only ${examQuestionCount} unique questions are available. The mock exam will use all of them.`,
        [{ text: 'Continue', onPress: openMockExam }],
      );
      return;
    }
    openMockExam();
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.brandMark}>
              <BookOpenCheck color={theme.textOnSolid} size={23} strokeWidth={2.4} />
            </View>
            <View style={styles.brandCopy}>
              <ThemedText style={styles.brandTitle}>LTO Reviewer</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.brandSubtitle}>
                Non-Professional
              </ThemedText>
            </View>
            <Pressable
              accessibilityLabel="Open settings"
              accessibilityRole="button"
              onPress={() => router.push('/settings')}
              style={({ pressed }) => [
                styles.settingsButton,
                { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                pressed && styles.cardPressed,
              ]}>
              <Settings color={theme.textSecondary} size={21} strokeWidth={2.3} />
            </Pressable>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <ClipboardCheck color={theme.primarySolid} size={27} strokeWidth={2.3} />
            </View>
            <ThemedText style={styles.heroEyebrow}>MOCK EXAM</ThemedText>
            <ThemedText style={styles.heroTitle}>Ready for your next review?</ThemedText>
            <ThemedText style={styles.heroDescription}>
              Practice under exam-style conditions and review every answer after submission.
            </ThemedText>
            <Pressable
              accessibilityLabel="Start Mock Exam, 60 random questions"
              accessibilityRole="button"
              onPress={handleStartMockExam}
              style={({ pressed }) => [
                styles.heroButton,
                pressed && styles.heroButtonPressed,
              ]}>
              <View style={styles.heroButtonCopy}>
                <ThemedText style={styles.heroButtonTitle}>Start Mock Exam</ThemedText>
                <ThemedText style={styles.heroButtonSubtitle}>60 Random Questions</ThemedText>
              </View>
              <ArrowRight color={theme.primarySolid} size={21} strokeWidth={2.6} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <ThemedText style={styles.sectionTitle}>Continue learning</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.sectionHint}>
                Choose a review mode
              </ThemedText>
            </View>

            <View style={styles.quickGrid}>
              <QuickActionCard
                accessibilityLabel="Practice Quiz, choose category and length"
                icon={<BookOpen color={theme.primary} size={22} strokeWidth={2.3} />}
                onPress={() => router.push('/quiz-setup')}
                subtitle="Choose topic and length"
                title="Practice Quiz"
              />
              <QuickActionCard
                accessibilityLabel={`Review Mistakes, ${mistakeReviewCount} questions need review`}
                icon={<Target color={theme.warning} size={22} strokeWidth={2.3} />}
                onPress={() => router.push('/mistake-review')}
                subtitle={
                  mistakeReviewCount === 0
                    ? 'All caught up'
                    : `${mistakeReviewCount} ${mistakeReviewCount === 1 ? 'question' : 'questions'} to review`
                }
                title="Review Mistakes"
              />
              <QuickActionCard
                accessibilityLabel={`Bookmarks, ${bookmarkCount} saved questions`}
                icon={
                  <Bookmark
                    color={theme.primary}
                    fill={bookmarkCount > 0 ? theme.primary : 'transparent'}
                    size={22}
                    strokeWidth={2.3}
                  />
                }
                onPress={() => router.push('/bookmarks')}
                subtitle={
                  bookmarkCount === 0
                    ? 'No saved questions'
                    : `${bookmarkCount} ${bookmarkCount === 1 ? 'question' : 'questions'} saved`
                }
                title="Bookmarks"
              />
              <QuickActionCard
                accessibilityLabel={`Exam History, ${examHistory.length} saved attempts`}
                icon={<History color={theme.success} size={22} strokeWidth={2.3} />}
                onPress={() => router.push('/history')}
                subtitle={
                  examHistory.length === 0
                    ? 'No attempts yet'
                    : `${examHistory.length} ${examHistory.length === 1 ? 'attempt' : 'attempts'} saved`
                }
                title="Exam History"
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <ThemedText style={styles.sectionTitle}>Your performance</ThemedText>
              <Pressable
                accessibilityLabel="Open all statistics"
                accessibilityRole="button"
                onPress={() => router.push('/statistics')}
                style={({ pressed }) => [styles.viewAllButton, pressed && styles.cardPressed]}>
                <ThemedText style={styles.viewAllText}>View all</ThemedText>
              </Pressable>
            </View>

            <Pressable
              accessibilityLabel={
                lastExam
                  ? `Last exam score ${lastExam.score} out of ${lastExam.totalQuestions}, ${lastExam.percentage} percent`
                  : 'No exam history. Open statistics.'
              }
              accessibilityRole="button"
              onPress={() => router.push('/statistics')}
              style={({ pressed }) => [
                styles.performanceCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                pressed && styles.cardPressed,
              ]}>
              <View style={styles.performanceHeader}>
                <View style={styles.performanceIcon}>
                  <BarChart3 color={theme.primary} size={21} strokeWidth={2.4} />
                </View>
                <View style={styles.performanceHeadingCopy}>
                  <ThemedText style={styles.performanceTitle}>Last Exam</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.performanceDate}>
                    {lastExam ? formatExamHistoryDate(lastExam.completedAt) : 'Your latest mock exam'}
                  </ThemedText>
                </View>
                <ChevronRight color={theme.textSecondary} size={20} strokeWidth={2.4} />
              </View>

              {lastExam ? (
                <View style={styles.lastExamContent}>
                  <View style={styles.scoreBlock}>
                    <ThemedText themeColor="textSecondary" style={styles.scoreLabel}>
                      SCORE
                    </ThemedText>
                    <ThemedText style={styles.scoreValue}>
                      {lastExam.score}{' '}
                      <ThemedText style={styles.scoreTotal}>/ {lastExam.totalQuestions}</ThemedText>
                    </ThemedText>
                  </View>
                  <View style={styles.scoreDivider} />
                  <View style={styles.percentageBlock}>
                    <ThemedText themeColor="textSecondary" style={styles.scoreLabel}>
                      ACCURACY
                    </ThemedText>
                    <ThemedText style={styles.percentageValue}>{lastExam.percentage}%</ThemedText>
                  </View>
                </View>
              ) : (
                <View style={styles.performanceEmpty}>
                  <ThemedText style={styles.performanceEmptyTitle}>No exam result yet</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.performanceEmptyText}>
                    Complete your first mock exam to see your latest score here.
                  </ThemedText>
                </View>
              )}
            </Pressable>
          </View>

          <ThemedText themeColor="textSecondary" style={styles.footerText}>
            All questions, results, and progress stay on this device.
          </ThemedText>
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
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
    paddingBottom: Spacing.five,
    gap: 22,
  },
  header: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandMark: { width: 44, height: 44, borderRadius: 14, backgroundColor: theme.primarySolid, alignItems: 'center', justifyContent: 'center' },
  brandCopy: { flex: 1, gap: 1 },
  brandTitle: { fontSize: 19, lineHeight: 25, fontWeight: '800' },
  brandSubtitle: { fontSize: 12, lineHeight: 17, fontWeight: '600' },
  settingsButton: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  heroCard: { borderRadius: 26, backgroundColor: theme.primarySolid, padding: 20, gap: 8 },
  heroIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: theme.textOnSolid, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  heroEyebrow: { color: theme.textOnSolidMuted, fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: theme.textOnSolid, fontSize: 25, lineHeight: 32, fontWeight: '800' },
  heroDescription: { color: theme.textOnSolidMuted, fontSize: 13, lineHeight: 20, fontWeight: '500' },
  heroButton: { minHeight: 60, marginTop: 8, borderRadius: 18, backgroundColor: theme.textOnSolid, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroButtonPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  heroButtonCopy: { flex: 1, gap: 1 },
  heroButtonTitle: { color: theme.primarySolid, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  heroButtonSubtitle: { color: theme.textOnLightSurfaceSecondary, fontSize: 11, lineHeight: 16, fontWeight: '600' },
  section: { gap: 12 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { flex: 1, fontSize: 17, lineHeight: 23, fontWeight: '800' },
  sectionHint: { fontSize: 10, lineHeight: 15, fontWeight: '600' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: '48%', minHeight: 132, borderWidth: 1, borderRadius: 20, padding: 14, alignItems: 'flex-start' },
  quickIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' },
  quickCopy: { flex: 1, alignSelf: 'stretch', justifyContent: 'flex-end', paddingTop: 10 },
  quickTitle: { fontSize: 14, lineHeight: 19, fontWeight: '800' },
  quickSubtitle: { marginTop: 2, fontSize: 10, lineHeight: 15, fontWeight: '600' },
  quickChevron: { position: 'absolute', top: 20, right: 14 },
  cardPressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  viewAllButton: { minHeight: 44, paddingHorizontal: 4, justifyContent: 'center' },
  viewAllText: { color: theme.primary, fontSize: 12, lineHeight: 18, fontWeight: '800' },
  performanceCard: { borderWidth: 1, borderRadius: 22, padding: Spacing.three, gap: 15 },
  performanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  performanceIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' },
  performanceHeadingCopy: { flex: 1, gap: 1 },
  performanceTitle: { fontSize: 14, lineHeight: 20, fontWeight: '800' },
  performanceDate: { fontSize: 10, lineHeight: 15, fontWeight: '600' },
  lastExamContent: { flexDirection: 'row', alignItems: 'stretch' },
  scoreBlock: { flex: 1, gap: 3 },
  percentageBlock: { flex: 1, alignItems: 'flex-end', gap: 3 },
  scoreDivider: { width: StyleSheet.hairlineWidth, backgroundColor: theme.border },
  scoreLabel: { fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 0.8 },
  scoreValue: { color: theme.primary, fontSize: 28, lineHeight: 34, fontWeight: '800' },
  scoreTotal: { color: theme.textSecondary, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  percentageValue: { color: theme.primary, fontSize: 28, lineHeight: 34, fontWeight: '800' },
  performanceEmpty: { borderRadius: 15, backgroundColor: theme.primarySoft, padding: 14, gap: 3 },
  performanceEmptyTitle: { color: theme.primary, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  performanceEmptyText: { fontSize: 11, lineHeight: 17 },
  footerText: { paddingHorizontal: 10, fontSize: 10, lineHeight: 16, textAlign: 'center' },
}));
