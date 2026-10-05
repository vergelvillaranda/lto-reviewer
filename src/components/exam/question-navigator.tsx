import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppFonts } from '@/constants/theme';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';

interface QuestionNavigatorProps {
  questionIds: readonly string[];
  currentIndex: number;
  answeredQuestionIds: ReadonlySet<string>;
  onSelect: (index: number) => void;
}

const CHIP_SIZE = 42;

export function QuestionNavigator({
  questionIds,
  currentIndex,
  answeredQuestionIds,
  onSelect,
}: QuestionNavigatorProps) {
  const theme = useTheme();
  const styles = useStyles();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: Math.max(0, currentIndex * (CHIP_SIZE + 8) - CHIP_SIZE * 2),
      animated: true,
    });
  }, [currentIndex]);

  return (
    <ScrollView
      ref={scrollRef}
      accessibilityLabel="Exam question navigator"
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {questionIds.map((questionId, index) => {
        const isCurrent = index === currentIndex;
        const isAnswered = answeredQuestionIds.has(questionId);

        return (
          <Pressable
            accessibilityLabel={`Question ${index + 1}, ${isAnswered ? 'answered' : 'unanswered'}${isCurrent ? ', current question' : ''}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isCurrent }}
            key={questionId}
            onPress={() => onSelect(index)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              },
              isAnswered && styles.answeredChip,
              isCurrent && styles.currentChip,
              pressed && styles.pressed,
            ]}>
            <Text
              style={[
                styles.number,
                { color: theme.textSecondary },
                isAnswered && styles.answeredNumber,
                isCurrent && styles.currentNumber,
              ]}>
              {index + 1}
            </Text>
            {isAnswered && !isCurrent && <View style={styles.answeredDot} />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const useStyles = createThemedStyles((theme) => ({
  content: { paddingHorizontal: 16, gap: 8 },
  chip: {
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answeredChip: {
    backgroundColor: theme.primarySoft,
    borderColor: theme.primarySoftBorder,
  },
  currentChip: {
    backgroundColor: theme.primarySolid,
    borderColor: theme.primary,
  },
  number: {
    fontFamily: AppFonts.bold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  answeredNumber: { color: theme.primary },
  currentNumber: { color: theme.textOnSolid },
  answeredDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.primarySolid,
  },
  pressed: { opacity: 0.7 },
}));
