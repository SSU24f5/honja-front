import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';

export function WelcomeBanner() {
  return (
    <ThemedView style={styles.container} type="backgroundElement">
      <View style={styles.content}>
        <ThemedText style={styles.tagline} themeColor="brandPrimary">
          나 홀로 제주 여행의 든든한 동반자
        </ThemedText>
        <ThemedText type="subtitle" style={styles.title}>
          혼저옵서예
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
          복잡한 계획은 이제 그만! 제주도 관광 명소 추천부터 이동 경로 자동 생성, 올레길 코스
          탐방까지 당신만의 제주 일정을 만들어 보세요.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.four,
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FAF5F2', // Subtle warm ivory tone to align with orange theme
  },
  content: {
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  tagline: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: Spacing.one,
  },
});
