import { CheckCircle2, XCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { QuizAnswer, QuizSessionQuestion } from '@/types/quiz';
import { getCorrectChoice, getSelectedChoice } from '@/utils/randomization';

interface AnswerFeedbackCardProps {
  answer: QuizAnswer;
  question: QuizSessionQuestion;
  showCorrectAnswerWhenCorrect?: boolean;
}

export function AnswerFeedbackCard({
  answer,
  question,
  showCorrectAnswerWhenCorrect = false,
}: AnswerFeedbackCardProps) {
  const theme = useTheme();
  const styles = useStyles();
  const selectedChoice = getSelectedChoice(question, answer.selectedAnswerId);
  const correctChoice = getCorrectChoice(question);
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.feedbackCard,
        answer.isCorrect ? styles.correctFeedback : styles.incorrectFeedback,
      ]}>
      <View style={styles.feedbackHeading}>
        {answer.isCorrect ? (
          <CheckCircle2 color={theme.success} size={23} />
        ) : (
          <XCircle color={theme.error} size={23} />
        )}
        <ThemedText
          style={[
            styles.feedbackTitle,
            { color: answer.isCorrect ? theme.success : theme.error },
          ]}>
          {answer.isCorrect ? 'Correct!' : 'Incorrect'}
        </ThemedText>
      </View>

      {!answer.isCorrect && (
        <View style={styles.answerSummary}>
          <View style={styles.answerSummaryItem}>
            <View style={styles.answerSummaryHeading}>
              <XCircle color={theme.error} size={16} />
              <ThemedText style={styles.yourAnswerLabel}>Your answer</ThemedText>
            </View>
            <ThemedText style={styles.yourAnswerText}>
              {selectedChoice?.text}
            </ThemedText>
          </View>
          <View style={[styles.answerSummaryItem, styles.correctAnswerSummary]}>
            <View style={styles.answerSummaryHeading}>
              <CheckCircle2 color={theme.success} size={16} />
              <ThemedText style={styles.correctAnswerLabel}>Correct answer</ThemedText>
            </View>
            <ThemedText style={styles.correctAnswerText}>
              {correctChoice?.text}
            </ThemedText>
          </View>
        </View>
      )}

      {answer.isCorrect && showCorrectAnswerWhenCorrect && (
        <View style={[styles.answerSummaryItem, styles.correctAnswerSummary]}>
          <View style={styles.answerSummaryHeading}>
            <CheckCircle2 color={theme.success} size={16} />
            <ThemedText style={styles.correctAnswerLabel}>Correct answer</ThemedText>
          </View>
          <ThemedText style={styles.correctAnswerText}>
            {correctChoice?.text}
          </ThemedText>
        </View>
      )}

      <ThemedText style={styles.explanation}>{question.explanation}</ThemedText>
      {question.source && (
        <View style={styles.sourceRow}>
          <ThemedText style={styles.sourceLabel}>SOURCE</ThemedText>
          <ThemedText style={styles.sourceText}>{question.source}</ThemedText>
        </View>
      )}
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  feedbackCard: { borderRadius: 18, padding: Spacing.three, borderWidth: 1, gap: 12 },
  correctFeedback: { backgroundColor: theme.successSoft, borderColor: theme.successSoftBorder },
  incorrectFeedback: { backgroundColor: theme.errorSoft, borderColor: theme.errorSoftBorder },
  feedbackHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feedbackTitle: { fontSize: 17, lineHeight: 23, fontWeight: '800' },
  answerSummary: { gap: 8 },
  answerSummaryItem: { borderRadius: 12, backgroundColor: theme.errorSoft, padding: 11, gap: 4 },
  correctAnswerSummary: { backgroundColor: theme.successSoft },
  answerSummaryHeading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  yourAnswerLabel: { color: theme.error, fontSize: 11, lineHeight: 15, fontWeight: '800' },
  yourAnswerText: { color: theme.error, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  correctAnswerLabel: { color: theme.success, fontSize: 11, lineHeight: 15, fontWeight: '800' },
  correctAnswerText: { color: theme.success, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  explanation: { color: theme.text, fontSize: 14, lineHeight: 21, fontWeight: '500' },
  sourceRow: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border, paddingTop: 10, gap: 3 },
  sourceLabel: { color: theme.textSecondary, fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 0.8 },
  sourceText: { color: theme.text, fontSize: 12, lineHeight: 18, fontWeight: '600' },
}));
