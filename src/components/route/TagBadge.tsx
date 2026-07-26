import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';

interface TagBadgeProps {
  label: string;
}

export function TagBadge({ label }: TagBadgeProps) {
  const isGeneral = label === '일반';

  return (
    <ThemedView type={isGeneral ? 'brandPrimary' : 'backgroundElement'} style={styles.badge}>
      <ThemedText
        type="smallBold"
        themeColor={isGeneral ? 'background' : 'textSecondary'}
        style={styles.label}
      >
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 12,
    marginRight: Spacing.one,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});
