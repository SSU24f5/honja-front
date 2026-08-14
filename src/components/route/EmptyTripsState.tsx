import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { Spacing } from '@/styles/theme';

// '내 여행' 목록이 비어있을 때 보여주는 화면
export function EmptyTripsState() {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" themeColor="textSecondary" style={styles.title}>
        혼저옵서예
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
        아직 만든 여행이 없어요
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    opacity: 0.4,
  },
  title: {
    fontSize: 28,
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 13,
  },
});