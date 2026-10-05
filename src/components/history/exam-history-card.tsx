import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import type { ExamHistoryRecord } from '@/types/exam-history';
import { formatExamHistoryDate, formatExamHistoryTime } from '@/utils/exam-history';

interface ExamHistoryCardProps {
  record: ExamHistoryRecord;
  onPress: () => void;
}

export function ExamHistoryCard({ record, onPress }: ExamHistoryCardProps) {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      accessibilityHint="Opens this mock exam attempt"
      accessibilityLabel={`${formatExamHistoryDate(record.completedAt)}, score ${record.score} out of ${record.totalQuestions}, ${record.percentage} percent`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        },
        pressed && styles.pressed,
      ]}>
      <View style={styles.topRow}>
        <View style={styles.dateCopy}>
          <ThemedText style={styles.date}>{formatExamHistoryDate(record.completedAt)}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.time}>
            {formatExamHistoryTime(record.completedAt)}
          </ThemedText>
        </View>
        <ChevronRight color={theme.textSecondary} size={21} strokeWidth={2.4} />
      </View>

      <View style={styles.scoreRow}>
        <ThemedText style={styles.score}>{record.score}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.total}>
          / {record.totalQuestions}
        </ThemedText>
        <View style={styles.percentagePill}>
          <ThemedText style={styles.percentage}>{record.percentage}%</ThemedText>
        </View>
      </View>

      <View style={styles.countsRow}>
        <View style={styles.countItem}>
          <View style={[styles.dot, styles.correctDot]} />
          <ThemedText themeColor="textSecondary" style={styles.countText}>
            Correct {record.correct}
          </ThemedText>
        </View>
        <View style={styles.countItem}>
          <View style={[styles.dot, styles.incorrectDot]} />
          <ThemedText themeColor="textSecondary" style={styles.countText}>
            Incorrect {record.incorrect}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    gap: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateCopy: { flex: 1, gap: 1 },
  date: { fontSize: 15, lineHeight: 21, fontWeight: '800' },
  time: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  score: { color: theme.primary, fontSize: 30, lineHeight: 36, fontWeight: '800' },
  total: { marginLeft: 4, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  percentagePill: {
    marginLeft: 'auto',
    borderRadius: 999,
    backgroundColor: theme.primarySoft,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  percentage: { color: theme.primary, fontSize: 13, lineHeight: 18, fontWeight: '800' },
  countsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  countItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  correctDot: { backgroundColor: theme.success },
  incorrectDot: { backgroundColor: theme.error },
  countText: { fontSize: 11, lineHeight: 16, fontWeight: '700' },
  pressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
}));
