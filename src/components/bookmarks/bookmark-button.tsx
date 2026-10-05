import { Bookmark } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { useBookmarkStore } from '@/stores/bookmark-store';

interface BookmarkButtonProps {
  questionId: string;
  compact?: boolean;
}

export function BookmarkButton({ questionId, compact = false }: BookmarkButtonProps) {
  const theme = useTheme();
  const styles = useStyles();
  const questionIds = useBookmarkStore((state) => state.questionIds);
  const hasLoaded = useBookmarkStore((state) => state.hasLoaded);
  const setBookmarked = useBookmarkStore((state) => state.setBookmarked);
  const isBookmarked = questionIds.includes(questionId);

  return (
    <Pressable
      accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
      accessibilityRole="button"
      accessibilityState={{ disabled: !hasLoaded, selected: isBookmarked }}
      disabled={!hasLoaded}
      hitSlop={8}
      onPress={() => void setBookmarked(questionId, !isBookmarked)}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compactButton,
        {
          backgroundColor: isBookmarked
            ? theme.primarySoft
            : theme.backgroundSelected,
        },
        pressed && styles.pressed,
      ]}>
      <Bookmark
        color={isBookmarked ? theme.primary : theme.textSecondary}
        fill={isBookmarked ? theme.primary : 'transparent'}
        size={compact ? 17 : 20}
        strokeWidth={2.4}
      />
    </Pressable>
  );
}

const useStyles = createThemedStyles((theme) => ({
  button: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactButton: { width: 34, height: 34, borderRadius: 11 },
  pressed: { opacity: 0.62, transform: [{ scale: 0.96 }] },
}));
