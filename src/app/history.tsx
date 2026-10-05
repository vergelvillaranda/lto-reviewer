import { router } from 'expo-router';
import { ArrowLeft, ClipboardList, RefreshCw } from 'lucide-react-native';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExamHistoryCard } from '@/components/history/exam-history-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useExamHistoryStore } from '@/stores/exam-history-store';

export default function HistoryScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const records = useExamHistoryStore((state) => state.records);
  const isLoading = useExamHistoryStore((state) => state.isLoading);
  const errorMessage = useExamHistoryStore((state) => state.errorMessage);
  const loadHistory = useExamHistoryStore((state) => state.loadHistory);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

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
            <ThemedText style={styles.eyebrow}>MOCK / PRACTICE EXAMS</ThemedText>
            <ThemedText style={styles.title}>Exam History</ThemedText>
          </View>
        </View>

        {isLoading && records.length === 0 ? (
          <View style={styles.centeredState}>
            <ActivityIndicator color={theme.primary} size="large" />
            <ThemedText themeColor="textSecondary" style={styles.stateText}>
              Loading exam history…
            </ThemedText>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.listContent,
              records.length === 0 && styles.emptyListContent,
            ]}
            data={records}
            keyExtractor={(record) => record.id}
            ListHeaderComponent={
              errorMessage ? (
                <View style={styles.errorCard}>
                  <ThemedText style={styles.errorTitle}>History unavailable</ThemedText>
                  <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void loadHistory()}
                    style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
                    <RefreshCw color={theme.error} size={16} strokeWidth={2.5} />
                    <ThemedText style={styles.retryText}>Try Again</ThemedText>
                  </Pressable>
                </View>
              ) : records.length > 0 ? (
                <ThemedText themeColor="textSecondary" style={styles.historyCount}>
                  {records.length} saved {records.length === 1 ? 'attempt' : 'attempts'} · newest first
                </ThemedText>
              ) : null
            }
            ListEmptyComponent={
              !errorMessage ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <ClipboardList color={theme.primary} size={30} strokeWidth={2.2} />
                  </View>
                  <ThemedText style={styles.emptyTitle}>No mock exams yet</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                    Completed mock exams will be saved here on this device.
                  </ThemedText>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.replace('/')}
                    style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}>
                    <ThemedText style={styles.startButtonText}>Back to Home</ThemedText>
                  </Pressable>
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <ExamHistoryCard
                onPress={() =>
                  router.push({ pathname: '/history-detail', params: { id: item.id } })
                }
                record={item}
              />
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
  listContent: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.five, gap: 12 },
  emptyListContent: { flexGrow: 1 },
  historyCount: { marginBottom: 2, fontSize: 12, lineHeight: 18, fontWeight: '600' },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateText: { fontSize: 13, lineHeight: 19 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emptyTitle: { fontSize: 20, lineHeight: 27, fontWeight: '800', textAlign: 'center' },
  emptyText: { marginTop: 5, maxWidth: 300, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  startButton: {
    marginTop: 20,
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: theme.primarySolid,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonPressed: { backgroundColor: theme.primaryPressed },
  startButtonText: { color: theme.textOnSolid, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  errorCard: { borderRadius: 16, backgroundColor: theme.errorSoft, padding: Spacing.three, gap: 5 },
  errorTitle: { color: theme.error, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  errorText: { color: theme.error, fontSize: 12, lineHeight: 18 },
  retryButton: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  retryText: { color: theme.error, fontSize: 12, lineHeight: 18, fontWeight: '800' },
  pressed: { opacity: 0.65 },
}));
