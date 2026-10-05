import { CheckCircle2, CircleDashed, XCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { MockExamAnswer, MockExamQuestionStatus } from '@/types/mock-exam';
import type { QuizSessionQuestion } from '@/types/quiz';
import { getMockExamSelectedChoice } from '@/utils/mock-exam';
import { getCorrectChoice } from '@/utils/randomization';

interface ExamReviewCardProps {
  answer?: MockExamAnswer;
  question: QuizSessionQuestion;
  questionNumber: number;
  status: MockExamQuestionStatus;
}

export function ExamReviewCard({
  answer,
  question,
  questionNumber,
  status,
}: ExamReviewCardProps) {
  const theme = useTheme();
  const styles = useStyles();
  const isCorrect = status === 'Correct';
  const selectedChoice = answer ? getMockExamSelectedChoice(question, answer) : undefined;
  const correctChoice = getCorrectChoice(question);
  const statusColor = status === 'Unanswered'
    ? theme.warning
    : isCorrect
      ? theme.success
      : theme.error;

  return (
    <ThemedView
      accessibilityLabel={`Question ${questionNumber}, ${status}`}
      type="backgroundElement"
      style={styles.card}>
      <View style={styles.metaRow}>
        <ThemedText style={styles.questionNumber}>Question {questionNumber}</ThemedText>
        <BookmarkButton compact questionId={question.id} />
        <View style={styles.status}>
          {status === 'Unanswered' ? (
            <CircleDashed color={statusColor} size={16} />
          ) : isCorrect ? (
            <CheckCircle2 color={statusColor} size={16} />
          ) : (
            <XCircle color={statusColor} size={16} />
          )}
          <ThemedText style={[styles.statusText, { color: statusColor }]}>
            {status.toUpperCase()}
          </ThemedText>
        </View>
      </View>

      <ThemedText themeColor="textSecondary" style={styles.category}>
        {question.category}
      </ThemedText>
      <ThemedText style={styles.prompt}>{question.prompt}</ThemedText>

      {answer && (
        <View
          style={[
            styles.answerBox,
            isCorrect ? styles.correctBox : styles.incorrectBox,
          ]}>
          <ThemedText style={[styles.answerLabel, { color: statusColor }]}>Your Answer</ThemedText>
          <ThemedText style={[styles.answerText, { color: statusColor }]}>
            {selectedChoice?.text}
          </ThemedText>
        </View>
      )}

      {!isCorrect && (
        <View style={[styles.answerBox, styles.correctBox]}>
          <ThemedText style={[styles.answerLabel, styles.correctText]}>Correct Answer</ThemedText>
          <ThemedText style={[styles.answerText, styles.correctText]}>
            {correctChoice?.text}
          </ThemedText>
        </View>
      )}

      <View style={styles.explanationBox}>
        <ThemedText style={styles.explanationLabel}>Explanation</ThemedText>
        <ThemedText style={styles.explanation}>{question.explanation}</ThemedText>
      </View>

      {question.source && (
        <ThemedText themeColor="textSecondary" style={styles.source}>
          Source: {question.source}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const useStyles = createThemedStyles((theme) => ({
  card: { borderRadius: 20, padding: Spacing.three, gap: 11 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  questionNumber: {
    flex: 1,
    color: theme.primary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusText: { fontSize: 11, lineHeight: 16, fontWeight: '800' },
  category: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  prompt: { fontSize: 15, lineHeight: 22, fontWeight: '700' },
  answerBox: { borderRadius: 12, padding: 11, gap: 3 },
  correctBox: { backgroundColor: theme.successSoft },
  incorrectBox: { backgroundColor: theme.errorSoft },
  answerLabel: { fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 0.4 },
  answerText: { fontSize: 13, lineHeight: 19, fontWeight: '600' },
  correctText: { color: theme.success },
  explanationBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
    paddingTop: 10,
    gap: 4,
  },
  explanationLabel: {
    color: theme.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  explanation: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
  source: { fontSize: 11, lineHeight: 17, fontStyle: 'italic' },
}));
