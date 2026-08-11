import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';
import { TripColors } from '@/styles/tripColors';

interface TagBadgeProps {
  label: string;
}

export function TagBadge({ label }: TagBadgeProps) {
  const isGeneral = label === '일반';

  return (
    <ThemedView
      style={[
        styles.badge,
        { backgroundColor: isGeneral ? TripColors.tagGeneral : TripColors.tagNeutral },
      ]}
    >
      <ThemedText type="smallBold" style={[styles.label, { color: TripColors.titleText }]}>
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
