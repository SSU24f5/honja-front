import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { PlaceReorderList } from '@/components/route/PlaceReorderList';
import { RoutePlanner } from '@/components/route/RoutePlanner';
import { useTheme } from '@/hooks/use-theme';
import { useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';

export default function RouteScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { itinerary } = useRouteStore();
  const [routeGenerated, setRouteGenerated] = useState(false);

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  const handleGenerateRoute = () => {
    setRouteGenerated(true);
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            나의 여행 경로
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            여행 코스를 짜고 최적의 방문 순서를 정해 보세요
          </ThemedText>
        </ThemedView>

        {/* Route Planner widgets */}
        <RoutePlanner />

        {/* Place Reordering widget */}
        <PlaceReorderList />

        {/* Generate Route Action Button */}
        {itinerary.length >= 2 && (
          <ThemedView style={styles.actionSection}>
            <Pressable
              onPress={handleGenerateRoute}
              style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
            >
              <SymbolView name="sparkles" tintColor="#FFFFFF" size={16} />
              <ThemedText style={styles.btnText}>최적 경로 생성하기</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* Resulting Route Path Representation */}
        {routeGenerated && itinerary.length >= 2 && (
          <ThemedView style={styles.resultCard} type="backgroundElement">
            <ThemedView style={styles.resultTitleRow}>
              <SymbolView name="checkmark.circle.fill" tintColor="#30B0C7" size={18} />
              <ThemedText type="smallBold" style={styles.resultTitle}>
                경로가 생성되었습니다!
              </ThemedText>
            </ThemedView>
            <ThemedText type="small" themeColor="textSecondary" style={styles.resultDesc}>
              {itinerary.map((p) => p.name).join(' → ')}
            </ThemedText>
            <ThemedText type="code" style={styles.statText}>
              예상 이동시간: 약 1시간 45분 | 총 거리: 32.4km
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flex: 1,
    paddingVertical: Spacing.four,
    gap: Spacing.five,
  },
  header: {
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
    gap: Spacing.one,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  actionSection: {
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
  },
  btn: {
    backgroundColor: '#5856D6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: Spacing.one,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  resultCard: {
    marginHorizontal: Spacing.four,
    padding: Spacing.four,
    borderRadius: 14,
    gap: Spacing.one,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  resultTitle: {
    color: '#30B0C7',
  },
  resultDesc: {
    fontSize: 13,
    marginTop: 4,
  },
  statText: {
    fontSize: 11,
    marginTop: 2,
    color: '#5856D6',
  },
});
