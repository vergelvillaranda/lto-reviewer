import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import type { CategoryPerformance } from '@/types/performance';

interface CategoryPerformanceCardProps {
  performance: CategoryPerformance;
}

export function CategoryPerformanceCard({ performance }: CategoryPerformanceCardProps) {
  const theme = useTheme();
  const styles = useStyles();
  const accuracy = performance.accuracy ?? 0;

  return (
    <View
      accessibilityLabel={`${performance.category}. ${performance.questionsAnswered} questions answered. ${performance.accuracy === null ? 'No accuracy data' : `${performance.accuracy} percent accuracy`}`}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
      ]}>
      <View style={styles.heading}>
        <ThemedText style={styles.category}>{performance.category}</ThemedText>
        <ThemedText style={styles.accuracy}>
          {performance.accuracy === null ? '—' : `${performance.accuracy}%`}
        </ThemedText>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
        <View style={[styles.progressFill, { width: `${accuracy}%` }]} />
      </View>

      <View style={styles.counts}>
        <ThemedText themeColor="textSecondary" style={styles.answered}>
          {performance.questionsAnswered} answered
        </ThemedText>
        <ThemedText style={styles.correct}>{performance.correct} correct</ThemedText>
        <ThemedText style={styles.incorrect}>{performance.incorrect} incorrect</ThemedText>
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  card: { borderWidth: 1, borderRadius: 18, padding: Spacing.three, gap: 11 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  category: { flex: 1, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  accuracy: { color: theme.primary, fontSize: 20, lineHeight: 26, fontWeight: '800' },
  progressTrack: { height: 10, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: theme.primarySolid },
  counts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  answered: { fontSize: 10, lineHeight: 15, fontWeight: '700' },
  correct: { color: theme.success, fontSize: 10, lineHeight: 15, fontWeight: '700' },
  incorrect: { color: theme.error, fontSize: 10, lineHeight: 15, fontWeight: '700' },
}));
