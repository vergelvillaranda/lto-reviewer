import { router } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Check,
  History,
  Info,
  Moon,
  RotateCcw,
  Smartphone,
  Sun,
  Target,
  Trash2,
  Vibrate,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import appConfig from '../../app.json';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useSettingsDataActions } from '@/hooks/use-settings-data-actions';
import { useTheme } from '@/hooks/use-theme';
import type { ThemePreference } from '@/services/theme-preference-storage';
import { useHapticPreferenceStore } from '@/stores/haptic-preference-store';
import { useThemePreferenceStore } from '@/stores/theme-preference-store';

interface ThemeOption {
  description: string;
  icon: (color: string) => ReactNode;
  label: string;
  value: ThemePreference;
}

interface DataActionRowProps {
  description: string;
  destructive?: boolean;
  icon: (color: string) => ReactNode;
  isBusy: boolean;
  label: string;
  onPress: () => void;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'system',
    label: 'System',
    description: 'Match your device appearance',
    icon: (color) => <Smartphone color={color} size={22} strokeWidth={2.3} />,
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Always use the light appearance',
    icon: (color) => <Sun color={color} size={22} strokeWidth={2.3} />,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Always use the dark appearance',
    icon: (color) => <Moon color={color} size={22} strokeWidth={2.3} />,
  },
];

function DataActionRow({
  description,
  destructive = false,
  icon,
  isBusy,
  label,
  onPress,
}: DataActionRowProps) {
  const theme = useTheme();
  const foreground = destructive ? theme.error : theme.text;

  return (
    <Pressable
      accessibilityHint={description}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isBusy }}
      disabled={isBusy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.dataRow,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
        isBusy && styles.disabled,
      ]}>
      <View
        style={[
          styles.dataIcon,
          { backgroundColor: destructive ? theme.errorSoft : theme.backgroundSelected },
        ]}>
        {icon(destructive ? theme.error : theme.textSecondary)}
      </View>
      <View style={styles.dataCopy}>
        <ThemedText style={[styles.dataLabel, { color: foreground }]}>{label}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.dataDescription}>
          {description}
        </ThemedText>
      </View>
      <Trash2 color={destructive ? theme.error : theme.textSecondary} size={19} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const preference = useThemePreferenceStore((state) => state.preference);
  const themeError = useThemePreferenceStore((state) => state.errorMessage);
  const setPreference = useThemePreferenceStore((state) => state.setPreference);
  const hapticsEnabled = useHapticPreferenceStore((state) => state.isEnabled);
  const hapticError = useHapticPreferenceStore((state) => state.errorMessage);
  const setHapticsEnabled = useHapticPreferenceStore((state) => state.setEnabled);
  const {
    confirmClearBookmarks,
    confirmClearExamHistory,
    confirmClearMistakes,
    confirmResetAllData,
    isBusy: isDataActionBusy,
  } = useSettingsDataActions();

  const preferenceError = themeError ?? hapticError;

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to home"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: theme.primarySoft },
              pressed && styles.pressed,
            ]}>
            <ArrowLeft color={theme.primary} size={22} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerCopy}>
            <ThemedText style={[styles.eyebrow, { color: theme.primary }]}>PREFERENCES</ThemedText>
            <ThemedText style={styles.title}>Settings</ThemedText>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeading}>
            <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.sectionDescription}>
              Choose how LTO Reviewer looks on this device.
            </ThemedText>
          </View>

          <View accessibilityRole="radiogroup" style={styles.optionList}>
            {themeOptions.map((option) => {
              const selected = option.value === preference;
              return (
                <Pressable
                  accessibilityLabel={`${option.label}. ${option.description}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={option.value}
                  onPress={() => void setPreference(option.value)}
                  style={({ pressed }) => [
                    styles.optionCard,
                    {
                      backgroundColor: selected ? theme.primarySoft : theme.backgroundElement,
                      borderColor: selected ? theme.primary : theme.border,
                    },
                    pressed && styles.pressed,
                  ]}>
                  <View
                    style={[
                      styles.optionIcon,
                      { backgroundColor: selected ? theme.primarySolid : theme.backgroundSelected },
                    ]}>
                    {option.icon(selected ? theme.textOnSolid : theme.textSecondary)}
                  </View>
                  <View style={styles.optionCopy}>
                    <ThemedText style={styles.optionLabel}>{option.label}</ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.optionDescription}>
                      {option.description}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.selectionIndicator,
                      { borderColor: selected ? theme.primarySolid : theme.border },
                      selected && { backgroundColor: theme.primarySolid },
                    ]}>
                    {selected && <Check color={theme.textOnSolid} size={14} strokeWidth={3} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.sectionHeading}>
            <ThemedText style={styles.sectionTitle}>Quiz</ThemedText>
          </View>
          <View
            style={[
              styles.settingCard,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}>
            <View style={[styles.settingIcon, { backgroundColor: theme.primarySoft }]}>
              <Vibrate color={theme.primary} size={22} />
            </View>
            <View style={styles.settingCopy}>
              <ThemedText style={styles.settingLabel}>Haptic Feedback</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.settingDescription}>
                Vibrate gently after checking an answer
              </ThemedText>
            </View>
            <Switch
              accessibilityLabel="Haptic Feedback"
              ios_backgroundColor={theme.backgroundSelected}
              onValueChange={(isEnabled) => void setHapticsEnabled(isEnabled)}
              thumbColor={theme.textOnSolid}
              trackColor={{ false: theme.backgroundSelected, true: theme.primarySolid }}
              value={hapticsEnabled}
            />
          </View>

          {preferenceError && (
            <View style={[styles.errorCard, { backgroundColor: theme.errorSoft }]}>
              <ThemedText style={[styles.errorText, { color: theme.error }]}>
                {preferenceError}
              </ThemedText>
            </View>
          )}

          <View style={styles.sectionHeading}>
            <ThemedText style={styles.sectionTitle}>Data</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.sectionDescription}>
              Remove locally stored progress from this device.
            </ThemedText>
          </View>
          <View style={styles.dataList}>
            <DataActionRow
              description="Delete all saved mock exam attempts"
              icon={(color) => <History color={color} size={21} />}
              isBusy={isDataActionBusy}
              label="Clear Exam History"
              onPress={confirmClearExamHistory}
            />
            <DataActionRow
              description="Delete all tracked mistake progress"
              icon={(color) => <Target color={color} size={21} />}
              isBusy={isDataActionBusy}
              label="Clear Mistake History"
              onPress={confirmClearMistakes}
            />
            <DataActionRow
              description="Remove every bookmarked question"
              icon={(color) => <Bookmark color={color} size={21} />}
              isBusy={isDataActionBusy}
              label="Clear Bookmarks"
              onPress={confirmClearBookmarks}
            />
            <DataActionRow
              description="Delete progress and restore default settings"
              destructive
              icon={(color) => <RotateCcw color={color} size={21} />}
              isBusy={isDataActionBusy}
              label="Reset All App Data"
              onPress={confirmResetAllData}
            />
          </View>

          <View style={styles.sectionHeading}>
            <ThemedText style={styles.sectionTitle}>About</ThemedText>
          </View>
          <View
            style={[
              styles.aboutCard,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}>
            <View style={[styles.aboutIcon, { backgroundColor: theme.primarySoft }]}>
              <Info color={theme.primary} size={23} />
            </View>
            <View style={styles.aboutCopy}>
              <ThemedText style={styles.aboutName}>LTO Reviewer</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.aboutVersion}>
                Version {appConfig.expo.version}
              </ThemedText>
              <View style={[styles.aboutDivider, { backgroundColor: theme.border }]} />
              <ThemedText themeColor="textSecondary" style={styles.disclaimer}>
                Practice reviewer only. Not affiliated with or endorsed by the Land Transportation
                Office.
              </ThemedText>
            </View>
          </View>

          <ThemedText themeColor="textSecondary" style={styles.storageNote}>
            Settings and progress are stored locally and work without an internet connection.
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: { paddingHorizontal: Spacing.three, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backButton: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1 },
  eyebrow: { fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 0.8 },
  title: { fontSize: 23, lineHeight: 30, fontWeight: '800' },
  content: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.five, gap: Spacing.three },
  sectionHeading: { gap: 4, marginTop: 4 },
  sectionTitle: { fontSize: 19, lineHeight: 26, fontWeight: '800' },
  sectionDescription: { fontSize: 13, lineHeight: 19 },
  optionList: { gap: 10 },
  optionCard: { minHeight: 76, borderWidth: 1.5, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optionCopy: { flex: 1, gap: 2 },
  optionLabel: { fontSize: 15, lineHeight: 21, fontWeight: '800' },
  optionDescription: { fontSize: 11, lineHeight: 17, fontWeight: '600' },
  selectionIndicator: { width: 24, height: 24, borderWidth: 1.5, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  settingCard: { minHeight: 80, borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1, gap: 2 },
  settingLabel: { fontSize: 15, lineHeight: 21, fontWeight: '800' },
  settingDescription: { fontSize: 11, lineHeight: 17, fontWeight: '600' },
  dataList: { gap: 10 },
  dataRow: { minHeight: 76, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dataIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  dataCopy: { flex: 1, gap: 2 },
  dataLabel: { fontSize: 14, lineHeight: 20, fontWeight: '800' },
  dataDescription: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  aboutCard: { borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 13 },
  aboutIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  aboutCopy: { flex: 1 },
  aboutName: { fontSize: 16, lineHeight: 22, fontWeight: '800' },
  aboutVersion: { marginTop: 2, fontSize: 12, lineHeight: 18, fontWeight: '600' },
  aboutDivider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
  disclaimer: { fontSize: 12, lineHeight: 19 },
  errorCard: { borderRadius: 14, padding: 13 },
  errorText: { fontSize: 12, lineHeight: 18, fontWeight: '700' },
  storageNote: { paddingHorizontal: 8, fontSize: 11, lineHeight: 17, textAlign: 'center' },
  pressed: { opacity: 0.68 },
  disabled: { opacity: 0.5 },
});
