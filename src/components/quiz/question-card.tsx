import { View } from 'react-native';

import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { QuestionCategory } from '@/types/quiz';

interface QuestionCardProps {
  category: QuestionCategory;
  prompt: string;
  bookmarkQuestionId?: string;
}

export function QuestionCard({ bookmarkQuestionId, category, prompt }: QuestionCardProps) {
  const styles = useStyles();
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.metaRow}>
        <View style={styles.categoryPill}>
          <ThemedText style={styles.categoryText}>{category}</ThemedText>
        </View>
        {bookmarkQuestionId && <BookmarkButton questionId={bookmarkQuestionId} />}
      </View>
      <ThemedText style={styles.prompt}>{prompt}</ThemedText>
    </ThemedView>
  );
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryPill: {
    marginRight: 'auto',
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: theme.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: theme.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  prompt: {
    fontSize: 21,
    lineHeight: 30,
    fontWeight: '700',
  },
}));
