import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/common/themed-view';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';
import { WeatherWidget } from '@/components/home/WeatherWidget';
import { OlleTrailList } from '@/components/home/OlleTrailList';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth-store';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);
  const profileImage = useAuthStore((state) => state.profileImage);

  const [selectedDay, setSelectedDay] = useState(8); // Wednesday (8th) is default selected
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  // Generate mockup dates matching the screenshot (Mon 6 ~ Sun 12)
  const mockupWeek = [
    { dayName: '월', dateNum: 6 },
    { dayName: '화', dateNum: 7 },
    { dayName: '수', dateNum: 8 },
    { dayName: '목', dateNum: 9 },
    { dayName: '금', dateNum: 10 },
    { dayName: '토', dateNum: 11 },
    { dayName: '일', dateNum: 12 },
  ];

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const handleLogout = () => {
    setShowProfilePopup(false);
    clearToken();
    router.replace('/welcome' as any);
  };

  const handleGoToProfile = () => {
    setShowProfilePopup(false);
    router.push('/mypage' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* 1. 통합 주황색 헤더 (달력, 아바타 포함) */}
      <View style={[styles.orangeHeader, { paddingTop: Math.max(safeAreaInsets.top, Spacing.four) }]}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerTitle}>혼저옵서예</Text>
            <Text style={styles.headerSubtitle}>[;어서오세요]</Text>
          </View>
          <Pressable onPress={() => setShowProfilePopup(!showProfilePopup)} style={styles.avatarContainer}>
            <Image
              source={{ uri: profileImage }}
              style={styles.avatarImage}
            />
          </Pressable>
        </View>

        {/* 캘린더 슬라이더 로우 */}
        <View style={styles.calendarRow}>
          {mockupWeek.map((item) => {
            const isSelected = item.dateNum === selectedDay;
            return (
              <Pressable
                key={item.dateNum}
                onPress={() => setSelectedDay(item.dateNum)}
                style={styles.calendarDayCell}
              >
                <Text style={styles.weekdayText}>{item.dayName}</Text>
                <View style={[styles.dateCircle, isSelected && styles.dateCircleSelected]}>
                  <Text style={[styles.dateNumText, isSelected && styles.dateNumTextSelected]}>
                    {item.dateNum}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* 프로필 팝업 오버레이 (절대 배치) */}
        {showProfilePopup && (
          <View style={styles.profilePopup}>
            <Text style={styles.profileName}>제주좋아박희진</Text>
            <Text style={styles.profileEmail}>heejin05@gmail.com</Text>
            <View style={styles.popupDivider} />
            <Pressable onPress={handleGoToProfile} style={styles.popupButton}>
              <Text style={styles.popupButtonText}>프로필 수정</Text>
            </Pressable>
            <Pressable onPress={handleLogout} style={styles.popupButton}>
              <Text style={styles.popupButtonText}>로그아웃</Text>
            </Pressable>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
      >
        <ThemedView style={styles.container}>
          {/* 2. 배너 */}
          <WelcomeBanner />

          {/* 3. 시간별 날씨 */}
          <WeatherWidget />

          {/* 4. 행사 리스트 */}
          <OlleTrailList />
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  orangeHeader: {
    backgroundColor: '#FF6623',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
    position: 'relative',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  calendarDayCell: {
    alignItems: 'center',
    flex: 1,
  },
  weekdayText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: Spacing.one,
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCircleSelected: {
    backgroundColor: '#FFFFFF',
  },
  dateNumText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateNumTextSelected: {
    color: '#FF6623',
  },
  profilePopup: {
    position: 'absolute',
    top: 90,
    right: Spacing.four,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.four,
    width: 190,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    zIndex: 100,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  profileEmail: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  popupDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: Spacing.two,
  },
  popupButton: {
    paddingVertical: Spacing.two,
  },
  popupButtonText: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.four,
  },
  container: {
    maxWidth: MaxContentWidth,
    flex: 1,
    paddingHorizontal: Spacing.two,
    gap: Spacing.five,
    backgroundColor: 'transparent',
  },
});
