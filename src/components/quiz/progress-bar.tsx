import { View } from 'react-native';

import { createThemedStyles, useTheme } from '@/hooks/use-theme';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const theme = useTheme();
  const styles = useStyles();
  const percentage = total === 0 ? 0 : Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <View
      accessibilityLabel={`${Math.round(percentage)} percent complete`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: current }}
      style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
      <View style={[styles.fill, { width: `${percentage}%` }]} />
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  track: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.primarySolid,
  },
}));
