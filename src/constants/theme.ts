/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import type { TextStyle } from 'react-native';

export const Colors = {
  light: {
    text: '#101828',
    background: '#F8FAFC',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E4EAF2',
    textSecondary: '#475467',
    primary: '#155EEF',
    primarySolid: '#155EEF',
    primaryPressed: '#004EEB',
    primarySoft: '#EFF4FF',
    primarySoftBorder: '#B2CCFF',
    success: '#067647',
    successSoft: '#ECFDF3',
    successSoftBorder: '#ABEFC6',
    error: '#B42318',
    errorSoft: '#FEF3F2',
    errorSoftBorder: '#FECDCA',
    warning: '#B54708',
    warningSoft: '#FFFAEB',
    warningSoftBorder: '#FEDF89',
    border: '#D0D5DD',
    textOnSolid: '#FFFFFF',
    textOnSolidMuted: '#D9E5FF',
    textOnLightSurfaceSecondary: '#475467',
  },
  dark: {
    text: '#F2F4F7',
    background: '#0B1220',
    backgroundElement: '#151E2E',
    backgroundSelected: '#263247',
    textSecondary: '#A8B3C7',
    primary: '#84ADFF',
    primarySolid: '#155EEF',
    primaryPressed: '#004EEB',
    primarySoft: '#172B4D',
    primarySoftBorder: '#2E5AAC',
    success: '#75E0A7',
    successSoft: '#0B2E22',
    successSoftBorder: '#176B49',
    error: '#FDA29B',
    errorSoft: '#3B1715',
    errorSoftBorder: '#8F3028',
    warning: '#FEC84B',
    warningSoft: '#39260D',
    warningSoftBorder: '#854A0E',
    border: '#344054',
    textOnSolid: '#FFFFFF',
    textOnSolidMuted: '#D9E5FF',
    textOnLightSurfaceSecondary: '#475467',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type AppTheme = { [Color in ThemeColor]: string };
export type AppColorScheme = keyof typeof Colors;

export const AppFonts = {
  regular: 'BricolageGrotesque_400Regular',
  medium: 'BricolageGrotesque_500Medium',
  semiBold: 'BricolageGrotesque_600SemiBold',
  bold: 'BricolageGrotesque_700Bold',
  extraBold: 'BricolageGrotesque_800ExtraBold',
} as const;

export function getAppFontFamily(fontWeight?: TextStyle['fontWeight']): string {
  let numericWeight = 400;

  if (typeof fontWeight === 'number') {
    numericWeight = fontWeight;
  } else if (fontWeight === 'bold') {
    numericWeight = 700;
  } else if (fontWeight && fontWeight !== 'normal') {
    const parsedWeight = Number.parseInt(fontWeight, 10);
    if (Number.isFinite(parsedWeight)) {
      numericWeight = parsedWeight;
    }
  }

  if (numericWeight >= 800) return AppFonts.extraBold;
  if (numericWeight >= 700) return AppFonts.bold;
  if (numericWeight >= 600) return AppFonts.semiBold;
  if (numericWeight >= 500) return AppFonts.medium;
  return AppFonts.regular;
}

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;
