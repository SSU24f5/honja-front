import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/styles/theme';

type StepType = 'list' | 'details';

export default function RouteScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const { savedRoutes } = useRouteStore();

  const [step, setStep] = useState<StepType>('list');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset selected tab on route change
  useEffect(() => {
    setSelectedDayIdx(0);
  }, [selectedRouteId]);

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

  const selectedRoute = savedRoutes.find((r) => r.id === selectedRouteId) || savedRoutes[0];

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* STEP 1: ROUTE LIST */}
        {step === 'list' && (
          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                내 경로
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                내가 계획한 제주도 여행 일정 리스트
              </ThemedText>
            </ThemedView>

            <View style={styles.list}>
              {savedRoutes.map((route) => (
                <ThemedView key={route.id} style={styles.routeCard} type="backgroundElement">
                  <ThemedView style={styles.routeCardHeader}>
                    <SymbolView name="map.fill" tintColor="#D36D3A" size={18} />
                    <ThemedText type="smallBold" style={styles.routeNameText}>
                      {route.name}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.routeDates}>
                    {route.dates} ({route.duration})
                  </ThemedText>
                  <ThemedText
                    type="small"
                    themeColor="textSecondary"
                    style={styles.routeDestinations}
                  >
                    경유지: {route.itinerary.map((p) => p.name).join(' → ')}
                  </ThemedText>
                  <ThemedView style={styles.routeCardActions}>
                    <Pressable
                      onPress={() => {
                        setSelectedRouteId(route.id);
                        setStep('details');
                      }}
                      style={({ pressed }) => [
                        styles.cardBtn,
                        styles.cardBtnPrimary,
                        pressed && styles.pressed,
                      ]}
                    >
                      <ThemedText style={styles.cardBtnTextPrimary}>상세 보기</ThemedText>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.cardBtn,
                        styles.cardBtnSecondary,
                        pressed && styles.pressed,
                      ]}
                    >
                      <ThemedText style={styles.cardBtnTextSecondary}>지도 보기</ThemedText>
                    </Pressable>
                  </ThemedView>
                </ThemedView>
              ))}
            </View>

            <Pressable
              onPress={() => router.push('/route/create' as any)}
              style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            >
              <ThemedText style={styles.actionBtnText}>경로 생성하기</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* STEP 2: ROUTE DETAILS */}
        {step === 'details' && selectedRoute && (
          <ThemedView style={styles.stepContainer}>
            <View style={styles.detailsHeaderRow}>
              <ThemedText style={styles.detailsHeaderTitle}>내 여행</ThemedText>
              <Pressable
                onPress={() => {
                  router.push('/route/create' as any);
                }}
                style={styles.editBtn}
              >
                <ThemedText style={styles.editBtnText}>여행 수정하기</ThemedText>
              </Pressable>
            </View>

            {/* Summary Card */}
            <View style={styles.detailsSummaryCard}>
              <View style={styles.detailsSummaryBadges}>
                <View style={styles.summaryBadgeTheme}>
                  <ThemedText style={styles.summaryBadgeThemeText}>
                    {selectedRoute.theme || '일반'}
                  </ThemedText>
                </View>
                <View style={styles.summaryBadgeCompanion}>
                  <ThemedText style={styles.summaryBadgeCompanionText}>
                    {selectedRoute.companion || '혼자'}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.detailsSummaryTitleRow}>
                <View style={styles.avatarRow}>
                  <View style={styles.avatarCircle}>
                    <ThemedText style={styles.avatarEmoji}>👩</ThemedText>
                  </View>
                  <View style={[styles.avatarCircle, { marginLeft: -8 }]}>
                    <ThemedText style={styles.avatarEmoji}>👨</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.detailsSummaryTitleText}>{selectedRoute.name}</ThemedText>
              </View>

              <View style={styles.detailsSummaryDateRow}>
                <ThemedText style={styles.detailsSummaryDateText}>
                  {selectedRoute.dates} ({selectedRoute.duration})
                </ThemedText>
              </View>
            </View>

            {/* Day Select Tabs */}
            {(() => {
              const parseDays = () => {
                try {
                  const parts = selectedRoute.dates.split('~');
                  const startParts = parts[0].trim().split('.');
                  const endParts = parts[1].trim().split('.');
                  const sDay = parseInt(startParts[2] || startParts[1], 10);
                  const eDay = parseInt(endParts[2] || endParts[1], 10);
                  const list = [];
                  for (let d = sDay; d <= eDay; d++) {
                    list.push(d);
                  }
                  return { list, month: parseInt(startParts[1], 10) };
                } catch (_e) {
                  return { list: [10, 11, 12, 13, 14], month: 7 };
                }
              };
              const { list: daysList, month } = parseDays();

              return (
                <View style={styles.tabsContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsScrollContent}
                  >
                    {daysList.map((dayNum, idx) => {
                      const isActive = selectedDayIdx === idx;
                      return (
                        <Pressable
                          key={dayNum}
                          onPress={() => setSelectedDayIdx(idx)}
                          style={[styles.dayTab, isActive && styles.dayTabActive]}
                        >
                          <ThemedText
                            style={[styles.dayTabText, isActive && styles.dayTabTextActive]}
                          >
                            {month}/{dayNum}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              );
            })()}

            {/* Place List */}
            {(() => {
              const dayPlaces = selectedRoute.itinerary.filter(
                (place) => place.day === selectedDayIdx,
              );

              return (
                <View style={styles.detailPlacesList}>
                  {dayPlaces.map((place, idx) => {
                    const isStart = place.type === 'start' || idx === 0;
                    const isEnd = place.type === 'end' || (idx === dayPlaces.length - 1 && idx > 0);
                    const isWaypoint = !isStart && !isEnd;

                    return (
                      <View key={place.id} style={styles.detailPlaceBox}>
                        <View style={styles.detailPlaceMain}>
                          <ThemedText style={styles.detailPlaceName}>{place.name}</ThemedText>
                          <ThemedText style={styles.detailPlaceAddr}>{place.address}</ThemedText>
                        </View>

                        {isWaypoint && (
                          <View style={styles.detailPlaceDistanceRow}>
                            <ThemedText style={styles.detailDistanceText}>
                              이전 장소에서 2.5km (4분)
                            </ThemedText>
                            <Pressable>
                              <ThemedText style={styles.viewRouteText}>
                                이동 경로 보기 &gt;
                              </ThemedText>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })()}

            {/* Footer Buttons */}
            <View style={{ gap: 10, marginTop: Spacing.two }}>
              <Pressable
                onPress={() => {
                  router.push('/map' as any);
                }}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              >
                <ThemedText style={styles.actionBtnText}>지도에서 보기</ThemedText>
              </Pressable>

              <Pressable
                onPress={() => setStep('list')}
                style={({ pressed }) => [
                  styles.actionBtn,
                  { backgroundColor: '#E5E5EA' },
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={[styles.actionBtnText, { color: '#000000' }]}>
                  목록으로
                </ThemedText>
              </Pressable>
            </View>
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
  stepContainer: {
    alignSelf: 'stretch',
    gap: Spacing.four,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
    gap: Spacing.one,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.light.titleColor,
  },
  subtitle: {
    fontSize: 14,
  },
  list: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  routeCard: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: Spacing.two,
  },
  routeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  routeNameText: {
    fontSize: 16,
    fontFamily: 'EF_jejudoldam',
    color: '#000000',
  },
  routeDates: {
    fontSize: 13,
  },
  routeDestinations: {
    fontSize: 12,
    marginTop: 2,
  },
  routeCardActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
    marginTop: Spacing.two,
  },
  cardBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBtnPrimary: {
    backgroundColor: '#D36D3A',
  },
  cardBtnTextPrimary: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cardBtnSecondary: {
    backgroundColor: '#E5E5EA',
  },
  cardBtnTextSecondary: {
    color: '#000000',
    fontSize: 13,
  },
  actionBtn: {
    backgroundColor: '#D36D3A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: Spacing.four,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  detailsHeaderTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#92390D', // Colors.light.titleColor
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  editBtn: {
    backgroundColor: '#F4E7DF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editBtnText: {
    color: '#92390D',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  detailsSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1.5,
    borderColor: '#92390D',
    marginHorizontal: Spacing.four,
  },
  detailsSummaryBadges: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  summaryBadgeTheme: {
    backgroundColor: '#FAD8C2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  summaryBadgeThemeText: {
    color: '#D36D3A',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  summaryBadgeCompanion: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  summaryBadgeCompanionText: {
    color: '#60646C',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  detailsSummaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.one,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarEmoji: {
    fontSize: 14,
  },
  detailsSummaryTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92390D',
    fontFamily: 'EF_jejudoldam',
  },
  detailsSummaryDateRow: {
    alignItems: 'flex-end',
  },
  detailsSummaryDateText: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  tabsContainer: {
    marginVertical: Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  tabsScrollContent: {
    gap: 8,
  },
  dayTab: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7A3B18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayTabActive: {
    backgroundColor: '#7A3B18',
  },
  dayTabText: {
    color: '#7A3B18',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  detailPlacesList: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  detailPlaceBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailPlaceMain: {
    gap: 4,
  },
  detailPlaceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92390D',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  detailPlaceAddr: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  detailPlaceDistanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  detailDistanceText: {
    fontSize: 12,
    color: '#D36D3A',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  viewRouteText: {
    fontSize: 12,
    color: '#D36D3A',
    fontFamily: 'NEXON_Lv2_Gothic',
    fontWeight: '500',
  },
});
