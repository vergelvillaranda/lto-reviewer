import { AlertCircle } from 'lucide-react-native';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { createThemedStyles, useTheme } from '@/hooks/use-theme';

interface StorageWarningProps {
  message: string;
}

export function StorageWarning({ message }: StorageWarningProps) {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      <AlertCircle color={theme.error} size={20} />
      <ThemedText style={styles.message}>{message}</ThemedText>
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.errorSoftBorder,
    backgroundColor: theme.errorSoft,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  message: {
    flex: 1,
    color: theme.error,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
}));
