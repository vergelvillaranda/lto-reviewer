import { Check, X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { AppFonts } from '@/constants/theme';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';

export type AnswerButtonState = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

interface AnswerButtonProps {
  letter: string;
  label: string;
  state: AnswerButtonState;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function AnswerButton({
  letter,
  label,
  state,
  selected,
  disabled,
  onPress,
}: AnswerButtonProps) {
  const theme = useTheme();
  const styles = useStyles();
  const isSelected = state === 'selected';
  const isCorrect = state === 'correct';
  const isIncorrect = state === 'incorrect';
  const accessibilityStatus = isSelected
    ? 'Selected answer'
    : isIncorrect
    ? 'Your answer, incorrect'
    : isCorrect
      ? selected
        ? 'Your answer, correct'
        : 'Correct answer'
      : undefined;

  return (
    <Pressable
      accessibilityLabel={`${letter}. ${label}${accessibilityStatus ? `. ${accessibilityStatus}` : ''}`}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
        isSelected && styles.selectedButton,
        isCorrect && styles.correctButton,
        isIncorrect && styles.incorrectButton,
        state === 'dimmed' && styles.dimmedButton,
        pressed && !disabled && styles.pressed,
      ]}>
      <View
        style={[
          styles.letterBadge,
          { backgroundColor: theme.backgroundSelected },
          isSelected && styles.selectedBadge,
          isCorrect && styles.correctBadge,
          isIncorrect && styles.incorrectBadge,
        ]}>
        <Text
          style={[
            styles.letter,
            { color: theme.text },
            isSelected && styles.selectedLetter,
            (isCorrect || isIncorrect) && styles.feedbackLetter,
          ]}>
          {letter}
        </Text>
      </View>
      <Text
        style={[
          styles.label,
          { color: theme.text },
          isSelected && styles.selectedText,
          isCorrect && styles.correctText,
          isIncorrect && styles.incorrectText,
        ]}>
        {label}
      </Text>
      {isCorrect && <Check color={theme.success} size={21} strokeWidth={3} />}
      {isIncorrect && <X color={theme.error} size={21} strokeWidth={3} />}
      {isSelected && <Text style={styles.selectedIndicator}>Selected</Text>}
    </Pressable>
  );
}

const useStyles = createThemedStyles((theme) => ({
  button: {
    minHeight: 64,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedButton: {
    backgroundColor: theme.primarySoft,
    borderColor: theme.primary,
    borderWidth: 2,
  },
  correctButton: {
    backgroundColor: theme.successSoft,
    borderColor: theme.success,
  },
  incorrectButton: {
    backgroundColor: theme.errorSoft,
    borderColor: theme.error,
  },
  dimmedButton: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.82,
  },
  letterBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadge: {
    backgroundColor: theme.primarySolid,
  },
  correctBadge: {
    backgroundColor: theme.successSoft,
  },
  incorrectBadge: {
    backgroundColor: theme.errorSoft,
  },
  letter: {
    fontFamily: AppFonts.extraBold,
    fontSize: 14,
    fontWeight: '800',
  },
  selectedLetter: {
    color: theme.textOnSolid,
  },
  feedbackLetter: {
    color: theme.text,
  },
  label: {
    flex: 1,
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
  },
  selectedText: {
    color: theme.primary,
  },
  selectedIndicator: {
    color: theme.primary,
    fontFamily: AppFonts.extraBold,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
  },
  correctText: {
    color: theme.success,
  },
  incorrectText: {
    color: theme.error,
  },
}));
