import { router } from 'expo-router';
import { ArrowLeft, Check, Play } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { questions } from '@/data/questions';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';
import { useQuizStore } from '@/stores/quiz-store';
import {
  questionCounts,
  quizCategories,
  type QuestionCount,
  type QuizCategory,
} from '@/types/quiz';
import { getAvailableQuestionCount } from '@/utils/quiz';

const categoryDescriptions: Record<QuizCategory, string> = {
  'All Questions': 'A balanced mix from every topic',
  'Road Signs': 'Regulatory, warning, and road markings',
  'Traffic Rules': 'Right of way, speed, and road conduct',
  Penalties: 'Violations, fines, and demerit rules',
  'Defensive Driving': 'Hazard awareness and safe responses',
  'General & Republic Acts': 'Licensing requirements and key laws',
};

export default function QuizSetupScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const startQuiz = useQuizStore((state) => state.startQuiz);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('All Questions');
  const [selectedCount, setSelectedCount] = useState<QuestionCount>(20);
  const availableCount = getAvailableQuestionCount(questions, selectedCategory);
  const actualCount = Math.min(selectedCount, availableCount);

  const handleStartQuiz = () => {
    startQuiz(selectedCategory, selectedCount);
    router.push('/quiz');
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
            <ThemedText style={styles.eyebrow}>FOCUSED PRACTICE</ThemedText>
            <ThemedText style={styles.title}>Practice Quiz</ThemedText>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.introCard}>
            <ThemedText style={styles.introTitle}>Build a review set</ThemedText>
            <ThemedText style={styles.introText}>
              Choose a topic and question count. Answers include immediate feedback and explanations.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <ThemedText style={styles.sectionTitle}>Category</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.sectionHint}>
                {availableCount} available
              </ThemedText>
            </View>

            <View style={styles.categoryList}>
              {quizCategories.map((category) => {
                const selected = category === selectedCategory;
                const categoryCount = getAvailableQuestionCount(questions, category);

                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={({ pressed }) => [
                      styles.categoryCard,
                      {
                        backgroundColor: selected
                          ? theme.primarySoft
                          : theme.backgroundElement,
                        borderColor: selected
                          ? theme.primary
                          : theme.backgroundSelected,
                      },
                      pressed && styles.pressed,
                    ]}>
                    <View style={styles.categoryCopy}>
                      <ThemedText style={[styles.categoryName, selected && styles.selectedText]}>
                        {category}
                      </ThemedText>
                      <ThemedText themeColor="textSecondary" style={styles.categoryDescription}>
                        {categoryDescriptions[category]}
                      </ThemedText>
                    </View>
                    <View style={styles.categoryMeta}>
                      <ThemedText
                        themeColor="textSecondary"
                        style={[styles.categoryCount, selected && styles.selectedText]}>
                        {categoryCount}
                      </ThemedText>
                      <View
                        style={[
                          styles.radio,
                          { borderColor: theme.textSecondary },
                          selected && styles.selectedRadio,
                        ]}>
                        {selected && <Check color={theme.textOnSolid} size={13} strokeWidth={3} />}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Number of questions</ThemedText>
            <View
              accessibilityRole="radiogroup"
              style={[styles.countGroup, { backgroundColor: theme.backgroundElement }]}>
              {questionCounts.map((count) => {
                const selected = count === selectedCount;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    key={count}
                    onPress={() => setSelectedCount(count)}
                    style={({ pressed }) => [
                      styles.countButton,
                      selected && styles.selectedCountButton,
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText style={[styles.countText, selected && styles.selectedCountText]}>
                      {count}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
            {actualCount < selectedCount && (
              <View style={styles.availabilityNote}>
                <ThemedText style={styles.availabilityText}>
                  This category has {availableCount} questions, so all {actualCount} will be used.
                </ThemedText>
              </View>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleStartQuiz}
            style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}>
            <Play color={theme.textOnSolid} fill={theme.textOnSolid} size={19} />
            <ThemedText style={styles.startButtonText}>Start {actualCount}-Question Quiz</ThemedText>
          </Pressable>
        </ScrollView>
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
  scrollContent: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.five, gap: Spacing.four },
  introCard: { borderRadius: 20, backgroundColor: theme.primarySoft, borderWidth: 1, borderColor: theme.primarySoftBorder, padding: Spacing.three, gap: 5 },
  introTitle: { color: theme.text, fontSize: 17, lineHeight: 23, fontWeight: '800' },
  introText: { color: theme.text, fontSize: 13, lineHeight: 20 },
  section: { gap: 12 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { flex: 1, fontSize: 17, lineHeight: 24, fontWeight: '800' },
  sectionHint: { fontSize: 12, lineHeight: 18 },
  categoryList: { gap: 10 },
  categoryCard: { minHeight: 76, borderWidth: 1.5, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryCopy: { flex: 1, gap: 2 },
  categoryName: { fontSize: 15, lineHeight: 21, fontWeight: '700' },
  categoryDescription: { fontSize: 12, lineHeight: 18, fontWeight: '500' },
  categoryMeta: { alignItems: 'flex-end', gap: 7 },
  categoryCount: { fontSize: 11, lineHeight: 14, fontWeight: '700' },
  selectedText: { color: theme.primary },
  radio: { width: 23, height: 23, borderWidth: 1.5, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  selectedRadio: { backgroundColor: theme.primarySolid, borderColor: theme.primary },
  countGroup: { flexDirection: 'row', borderRadius: 18, padding: 5, gap: 5 },
  countButton: { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  selectedCountButton: { backgroundColor: theme.primarySolid },
  countText: { fontSize: 16, lineHeight: 22, fontWeight: '800' },
  selectedCountText: { color: theme.textOnSolid },
  availabilityNote: { backgroundColor: theme.warningSoft, borderRadius: 12, padding: 12 },
  availabilityText: { color: theme.warning, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  startButton: { minHeight: 58, borderRadius: 18, backgroundColor: theme.primarySolid, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  startButtonPressed: { backgroundColor: theme.primaryPressed, transform: [{ scale: 0.99 }] },
  startButtonText: { color: theme.textOnSolid, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  pressed: { opacity: 0.68 },
}));
