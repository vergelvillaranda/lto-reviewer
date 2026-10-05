import { router } from 'expo-router';
import { ArrowLeft, Bookmark, Play, RefreshCw } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { questions } from '@/data/questions';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { useQuizStore } from '@/stores/quiz-store';

export default function BookmarksScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const questionIds = useBookmarkStore((state) => state.questionIds);
  const isLoading = useBookmarkStore((state) => state.isLoading);
  const hasLoaded = useBookmarkStore((state) => state.hasLoaded);
  const errorMessage = useBookmarkStore((state) => state.errorMessage);
  const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks);
  const startBookmarkedQuiz = useQuizStore((state) => state.startBookmarkedQuiz);
  const bookmarkedQuestions = useMemo(() => {
    const questionById = new Map(questions.map((question) => [question.id, question]));
    return questionIds.flatMap((questionId) => {
      const question = questionById.get(questionId);
      return question ? [question] : [];
    });
  }, [questionIds]);
  const missingQuestionCount = questionIds.length - bookmarkedQuestions.length;

  const startPractice = () => {
    const questionCount = startBookmarkedQuiz(
      bookmarkedQuestions.map((question) => question.id),
    );
    if (questionCount > 0) {
      router.push('/quiz');
    }
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
            <ThemedText style={styles.eyebrow}>SAVED FOR LATER</ThemedText>
            <ThemedText style={styles.title}>Bookmarked Questions</ThemedText>
          </View>
        </View>

        {!hasLoaded || isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={theme.primary} size="large" />
            <ThemedText themeColor="textSecondary" style={styles.loadingText}>
              Loading bookmarks…
            </ThemedText>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.listContent,
              bookmarkedQuestions.length === 0 && styles.emptyListContent,
            ]}
            data={bookmarkedQuestions}
            keyExtractor={(question) => question.id}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                {errorMessage && (
                  <View style={styles.errorCard}>
                    <View style={styles.errorCopy}>
                      <ThemedText style={styles.errorTitle}>Bookmarks unavailable</ThemedText>
                      <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
                    </View>
                    <Pressable
                      accessibilityLabel="Retry loading bookmarks"
                      accessibilityRole="button"
                      hitSlop={8}
                      onPress={() => void loadBookmarks()}>
                      <RefreshCw color={theme.error} size={19} />
                    </Pressable>
                  </View>
                )}

                {bookmarkedQuestions.length > 0 && (
                  <View style={styles.practiceCard}>
                    <View style={styles.practiceCopy}>
                      <ThemedText style={styles.practiceTitle}>
                        {bookmarkedQuestions.length}{' '}
                        {bookmarkedQuestions.length === 1 ? 'question' : 'questions'} saved
                      </ThemedText>
                      <ThemedText style={styles.practiceText}>
                        Practice this exact set with immediate answer feedback.
                      </ThemedText>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      onPress={startPractice}
                      style={({ pressed }) => [
                        styles.practiceButton,
                        pressed && styles.practiceButtonPressed,
                      ]}>
                      <Play color={theme.textOnSolid} fill={theme.textOnSolid} size={17} />
                      <ThemedText style={styles.practiceButtonText}>Start Practice</ThemedText>
                    </Pressable>
                  </View>
                )}

                {missingQuestionCount > 0 && (
                  <View style={styles.warningCard}>
                    <ThemedText style={styles.warningText}>
                      {missingQuestionCount} saved bookmark{' '}
                      {missingQuestionCount === 1 ? 'is' : 'are'} no longer available in the local
                      question bank and will be skipped.
                    </ThemedText>
                  </View>
                )}

                {bookmarkedQuestions.length > 0 && (
                  <View style={styles.listHeading}>
                    <ThemedText style={styles.listTitle}>Saved Questions</ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.listHint}>
                      Tap the bookmark to remove
                    </ThemedText>
                  </View>
                )}
              </View>
            }
            ListEmptyComponent={
              !errorMessage ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <Bookmark color={theme.primary} size={31} strokeWidth={2.2} />
                  </View>
                  <ThemedText style={styles.emptyTitle}>No bookmarked questions</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                    Use the bookmark icon while taking a quiz or reviewing answers.
                  </ThemedText>
                </View>
              ) : null
            }
            renderItem={({ item, index }) => (
              <ThemedView type="backgroundElement" style={styles.questionCard}>
                <View style={styles.questionMeta}>
                  <ThemedText style={styles.questionNumber}>Question {index + 1}</ThemedText>
                  <BookmarkButton questionId={item.id} />
                </View>
                <ThemedText themeColor="textSecondary" style={styles.category}>
                  {item.category}
                </ThemedText>
                <ThemedText style={styles.prompt}>{item.prompt}</ThemedText>
              </ThemedView>
            )}
            showsVerticalScrollIndicator={false}
          />
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
  listContent: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.five, gap: 11 },
  emptyListContent: { flexGrow: 1 },
  listHeader: { gap: 12, marginBottom: 2 },
  errorCard: { borderRadius: 15, backgroundColor: theme.errorSoft, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  errorCopy: { flex: 1, gap: 2 },
  errorTitle: { color: theme.error, fontSize: 13, lineHeight: 19, fontWeight: '800' },
  errorText: { color: theme.error, fontSize: 11, lineHeight: 16 },
  practiceCard: { borderRadius: 20, backgroundColor: theme.primarySoft, borderWidth: 1, borderColor: theme.primarySoftBorder, padding: Spacing.three, gap: 12 },
  practiceCopy: { gap: 3 },
  practiceTitle: { color: theme.text, fontSize: 17, lineHeight: 23, fontWeight: '800' },
  practiceText: { color: theme.text, fontSize: 12, lineHeight: 18 },
  practiceButton: { minHeight: 48, borderRadius: 15, backgroundColor: theme.primarySolid, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  practiceButtonPressed: { backgroundColor: theme.primaryPressed },
  practiceButtonText: { color: theme.textOnSolid, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  warningCard: { borderRadius: 14, backgroundColor: theme.warningSoft, padding: 12 },
  warningText: { color: theme.warning, fontSize: 12, lineHeight: 18, fontWeight: '600' },
  listHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  listTitle: { flex: 1, fontSize: 17, lineHeight: 23, fontWeight: '800' },
  listHint: { fontSize: 10, lineHeight: 15, fontWeight: '600' },
  questionCard: { borderRadius: 18, padding: Spacing.three, gap: 7 },
  questionMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  questionNumber: { flex: 1, color: theme.primary, fontSize: 11, lineHeight: 16, fontWeight: '800' },
  category: { fontSize: 10, lineHeight: 15, fontWeight: '700', textTransform: 'uppercase' },
  prompt: { fontSize: 15, lineHeight: 22, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four, gap: 6 },
  emptyIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 20, lineHeight: 27, fontWeight: '800', textAlign: 'center' },
  emptyText: { maxWidth: 310, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  pressed: { opacity: 0.65 },
}));
