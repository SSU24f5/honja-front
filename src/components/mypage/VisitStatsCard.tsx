import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useMyPageStore } from '@/stores/mypageStore';
import { Spacing } from '@/styles/theme';

export function VisitStatsCard() {
  const { visitCount, stamps } = useMyPageStore();
  const earnedCount = stamps.filter((s) => s.earned).length;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.statItem}>
        <View style={styles.iconCircle}>
          <SymbolView name="airplane" tintColor="#FFFFFF" size={18} />
        </View>
        <View style={styles.statText}>
          <ThemedText type="small" themeColor="textSecondary">
            제주 방문 횟수
          </ThemedText>
          <ThemedText type="subtitle" style={styles.statValue}>
            {visitCount}회
          </ThemedText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <View style={[styles.iconCircle, styles.iconCircleStamp]}>
          <SymbolView name="checkmark.seal.fill" tintColor="#FFFFFF" size={18} />
        </View>
        <View style={styles.statText}>
          <ThemedText type="small" themeColor="textSecondary">
            획득 스탬프
          </ThemedText>
          <ThemedText type="subtitle" style={styles.statValue}>
            {earnedCount}개
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 16,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D36D3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleStamp: {
    backgroundColor: '#C85C2C',
  },
  statText: {
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginHorizontal: Spacing.two,
  },
});
