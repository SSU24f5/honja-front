import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { ProfileEditForm } from '@/components/mypage/ProfileEditForm';
import { StampGrid } from '@/components/mypage/StampGrid';
import { VisitStatsCard } from '@/components/mypage/VisitStatsCard';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';

export default function MyPageScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

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

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            마이페이지
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            프로필 정보를 관리하고 획득한 여행 스탬프를 확인해 보세요
          </ThemedText>
        </ThemedView>

        {/* Visit statistics card */}
        <VisitStatsCard />

        {/* Profile information & visit count widget */}
        <ProfileEditForm />

        {/* Stamp board collection widget */}
        <StampGrid />
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
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.five,
  },
  header: {
    alignItems: 'flex-start',
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
});
