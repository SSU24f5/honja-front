import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { View } from 'react-native';

interface TagBadgeProps {
  label: string;
}

// 실제 route.tsx의 routeCardBadge 스타일과 동일하게 맞춘 동행유형 뱃지
export function TagBadge({ label }: TagBadgeProps) {
  return (
    <View style={styles.badge}>
      <ThemedText style={styles.label} numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#91A267',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 0,
  },
  label: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});