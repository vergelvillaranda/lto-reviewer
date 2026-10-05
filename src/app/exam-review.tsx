import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExamReviewCard } from '@/components/exam/exam-review-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { useMockExamStore } from '@/stores/mock-exam-store';
import {
  mockExamReviewFilters,
  type MockExamReviewFilter,
} from '@/types/mock-exam';
import {
  countMockExamReviewItems,
  createMockExamReviewItems,
  filterMockExamReviewItems,
} from '@/utils/mock-exam-review';

export default function ExamReviewScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const examQuestions = useMockExamStore((state) => state.examQuestions);
  const answers = useMockExamStore((state) => state.answers);
  const isSubmitted = useMockExamStore((state) => state.isSubmitted);
  const [selectedFilter, setSelectedFilter] =
    useState<MockExamReviewFilter>('Incorrect');
  const reviewItems = useMemo(
    () => createMockExamReviewItems(examQuestions, answers),
    [answers, examQuestions],
  );
  const filterCounts = useMemo(
    () => countMockExamReviewItems(reviewItems),
    [reviewItems],
  );
  const filteredItems = useMemo(
    () => filterMockExamReviewItems(reviewItems, selectedFilter),
    [reviewItems, selectedFilter],
  );

  useEffect(() => {
    if (!isSubmitted || examQuestions.length === 0) {
      router.replace('/');
    }
  }, [examQuestions.length, isSubmitted]);

  if (!isSubmitted || examQuestions.length === 0) {
    return <ThemedView style={styles.screen} />;
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to exam results"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <ArrowLeft color={theme.primary} size={22} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerCopy}>
            <ThemedText style={styles.eyebrow}>MOCK/PRACTICE EXAM</ThemedText>
            <ThemedText style={styles.title}>Review Answers</ThemedText>
          </View>
        </View>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={filteredItems}
          initialNumToRender={7}
          keyExtractor={(item) => item.question.id}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.reviewNotice}>
                <ThemedText style={styles.reviewNoticeTitle}>Submitted answer review</ThemedText>
                <ThemedText style={styles.reviewNoticeText}>
                  This review belongs to a practice exam and is not an official LTO result.
                </ThemedText>
              </View>

              <View style={styles.filterSection}>
                <View style={styles.filterHeading}>
                  <ThemedText style={styles.filterTitle}>Filter questions</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.filterCount}>
                    Showing {filteredItems.length} of {reviewItems.length}
                  </ThemedText>
                </View>
                <View style={styles.filterGrid}>
                  {mockExamReviewFilters.map((filter) => {
                    const selected = filter === selectedFilter;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        key={filter}
                        onPress={() => setSelectedFilter(filter)}
                        style={({ pressed }) => [
                          styles.filterButton,
                          {
                            backgroundColor: selected
                              ? theme.primarySolid
                              : theme.backgroundElement,
                            borderColor: selected
                              ? theme.primary
                              : theme.backgroundSelected,
                          },
                          pressed && styles.pressed,
                        ]}>
                        <ThemedText
                          style={[
                            styles.filterButtonText,
                            selected && styles.selectedFilterText,
                          ]}>
                          {filter}
                        </ThemedText>
                        <View
                          style={[
                            styles.filterBadge,
                            selected && styles.selectedFilterBadge,
                          ]}>
                          <ThemedText
                            style={[
                              styles.filterBadgeText,
                              selected && styles.selectedFilterBadgeText,
                            ]}>
                            {filterCounts[filter]}
                          </ThemedText>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <ThemedView type="backgroundElement" style={styles.emptyCard}>
              <ThemedText style={styles.emptyTitle}>No {selectedFilter.toLowerCase()} questions</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                Choose another filter to continue reviewing your submitted exam.
              </ThemedText>
            </ThemedView>
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
  eyebrow: {
    color: theme.primary,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: { fontSize: 23, lineHeight: 30, fontWeight: '800' },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: 12,
  },
  listHeader: { gap: 14, marginBottom: 4 },
  reviewNotice: {
    borderRadius: 16,
    backgroundColor: theme.primarySoft,
    padding: Spacing.three,
    gap: 4,
  },
  reviewNoticeTitle: {
    color: theme.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  reviewNoticeText: { color: theme.text, fontSize: 12, lineHeight: 18 },
  filterSection: { gap: 9 },
  filterHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterTitle: { flex: 1, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  filterCount: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterButton: {
    width: '48%',
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  filterButtonText: { fontSize: 12, lineHeight: 17, fontWeight: '800' },
  selectedFilterText: { color: theme.textOnSolid },
  filterBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: theme.primarySoft,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFilterBadge: { backgroundColor: theme.textOnSolid },
  filterBadgeText: { color: theme.primary, fontSize: 10, fontWeight: '800' },
  selectedFilterBadgeText: { color: theme.primarySolid },
  emptyCard: { borderRadius: 18, padding: Spacing.four, alignItems: 'center', gap: 5 },
  emptyTitle: { fontSize: 16, lineHeight: 22, fontWeight: '800', textAlign: 'center' },
  emptyText: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  pressed: { opacity: 0.65 },
}));
