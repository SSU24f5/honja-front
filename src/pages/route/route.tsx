import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LeftBackIcon from '@/assets/icon/basic/left_back.svg';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useDayPlanning } from '@/hooks/use-day-planning';
import { useTheme } from '@/hooks/use-theme';
import { type SavedRoute, useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';
import { PlaceSearchModal } from './PlaceSearchModal';
import { THEME_TO_COURSE_TYPE } from './constants';

type StepType = 'list' | 'details';

export default function RouteScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const { savedRoutes } = useRouteStore();

  const {
    searchModalVisible,
    selectedDayIdx,
    currentPlan,
    setSelectedRouteId: setStoreRouteId,
    setSelectedDayIdx,
    openSearch,
    closeSearch,
    selectPlace,
    removePlace,
    removeWaypoint,
  } = useDayPlanning();

  const [step, setStep] = useState<StepType>('list');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset selected tab on route change
  useEffect(() => {
    setStoreRouteId(selectedRouteId);
  }, [selectedRouteId]);

  // Handle back press in search modal
  useEffect(() => {
    if (!searchModalVisible) return;
    const backAction = () => {
      closeSearch();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [searchModalVisible, closeSearch]);

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

  const selectedRoute = savedRoutes.find((r) => r.id === selectedRouteId) || null;

  // Parse days from selected route dates
  const { daysList, month } = useMemo(() => {
    if (!selectedRoute) return { daysList: [], month: 8 };
    try {
      const parts = selectedRoute.dates.split('~');
      const startParts = parts[0].trim().split('.');
      const endParts = parts[1].trim().split('.');
      const sDay = parseInt(startParts[2] || startParts[1], 10);
      const eDay = parseInt(endParts[2] || endParts[1], 10);
      const m = parseInt(startParts[1], 10);
      const list = [];
      for (let d = sDay; d <= eDay; d++) {
        list.push(d);
      }
      return { daysList: list, month: m };
    } catch {
      return { daysList: [10, 11, 12, 13, 14], month: 7 };
    }
  }, [selectedRoute]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      {!searchModalVisible && (
        <ScrollView
          style={[s.scrollView, { backgroundColor: theme.background }]}
          contentInset={insets}
          contentContainerStyle={[s.contentContainer, contentPlatformStyle]}
        >
          <ThemedView style={[s.container, { backgroundColor: theme.background }]}>
            {/* ── STEP 1: 내 여행 목록 ── */}
            {step === 'list' && (
              <View style={s.stepContainer}>
                {/* Header */}
                <View style={s.listHeader}>
                  <ThemedText style={s.listTitle}>내 여행</ThemedText>
                  <Pressable style={s.mailIcon}>
                    <ThemedText style={{ fontSize: 24 }}>✉️</ThemedText>
                  </Pressable>
                </View>

                {/* Route Cards */}
                <View style={s.routeList}>
                  {savedRoutes.map((route) => (
                    <Pressable
                      key={route.id}
                      onPress={() => {
                        setSelectedRouteId(route.id);
                        setStep('details');
                      }}
                      style={({ pressed }) => [s.routeCard, pressed && s.pressed]}
                    >
                      <View style={s.routeCardTop}>
                        <ThemedText style={s.routeCardDate}>
                          {route.dates.replace(/\./g, '/')}
                        </ThemedText>
                        <View style={s.routeCardBadge}>
                          <ThemedText style={s.routeCardBadgeText}>
                            {route.theme || '일반'}
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText style={s.routeCardName}>{route.name}</ThemedText>
                      {route.itinerary.length > 0 && (
                        <ThemedText style={s.routeCardDesc}>
                          {route.itinerary.map((p) => p.name).join(' → ')}
                        </ThemedText>
                      )}
                    </Pressable>
                  ))}

                  {savedRoutes.length === 0 && (
                    <View style={s.emptyState}>
                      <ThemedText style={s.emptyStateText}>
                        아직 생성된 여행이 없습니다.
                      </ThemedText>
                    </View>
                  )}
                </View>

                {/* 여행 생성하기 버튼 */}
                <Pressable
                  onPress={() => router.push('/route/create' as any)}
                  style={({ pressed }) => [s.createBtn, pressed && s.pressed]}
                >
                  <ThemedText style={s.createBtnText}>여행 생성하기</ThemedText>
                </Pressable>
              </View>
            )}

            {/* ── STEP 2: 상세보기 (디자인 2번) ── */}
            {step === 'details' && selectedRoute && (
              <View style={s.stepContainer}>
                {/* Back Arrow */}
                <View style={s.detailHeaderRow}>
                  <Pressable onPress={() => setStep('list')} hitSlop={12}>
                    <LeftBackIcon width={11} height={17} />
                  </Pressable>
                </View>

                {/* Route Title + 초대하기 */}
                <View style={s.detailTitleRow}>
                  <ThemedText style={s.detailTitle}>{selectedRoute.name}</ThemedText>
                  <Pressable style={s.inviteBtn}>
                    <ThemedText style={s.inviteBtnText}>초대하기</ThemedText>
                  </Pressable>
                </View>

                {/* Summary Card */}
                <View style={s.detailSummaryCard}>
                  <View style={s.detailSummaryTop}>
                    <ThemedText style={s.detailSummaryDate}>
                      {selectedRoute.dates.replace(/\./g, '/')}
                    </ThemedText>
                    <View style={s.detailSummaryBadge}>
                      <ThemedText style={s.detailSummaryBadgeText}>
                        {selectedRoute.theme || '일반'}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={s.detailSummaryDesc}>
                    {selectedRoute.companion || '혼자'}
                  </ThemedText>
                </View>

                {/* Day Tabs */}
                <View style={s.dayTabsRow}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={s.dayTabsContent}
                  >
                    {daysList.map((dayNum, idx) => {
                      const isActive = selectedDayIdx === idx;
                      return (
                        <Pressable
                          key={dayNum}
                          onPress={() => setSelectedDayIdx(idx)}
                          style={[s.dayTab, isActive && s.dayTabActive]}
                        >
                          <ThemedText
                            style={[s.dayTabText, isActive && s.dayTabTextActive]}
                          >
                            {month}/{dayNum}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* 출발지 */}
                <View style={s.planSection}>
                  <View style={s.planLabelRow}>
                    <ThemedText style={s.planLabel}>출발지</ThemedText>
                    <ThemedText style={s.planRequired}>*</ThemedText>
                  </View>
                  {currentPlan.start ? (
                    <View style={s.planFilledBox}>
                      <ThemedText style={s.planFilledText}>{currentPlan.start.name}</ThemedText>
                      <Pressable onPress={() => removePlace('start')}>
                        <ThemedText style={s.planRemoveBtn}>✕</ThemedText>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable onPress={() => openSearch('start')} style={s.planEmptyBox}>
                      <ThemedText style={s.planEmptyText}>출발지를 추가해주세요.</ThemedText>
                    </Pressable>
                  )}
                </View>

                {/* 중간 경로 */}
                <View style={s.planSection}>
                  <Pressable
                    onPress={() => openSearch('waypoint')}
                    style={s.planLabelRow}
                  >
                    <ThemedText style={s.planLabel}>중간 경로</ThemedText>
                    <ThemedText style={s.planChevron}>{'›'}</ThemedText>
                  </Pressable>

                  {currentPlan.waypoints.map((wp, idx) => (
                    <View key={wp.id} style={s.planFilledBox}>
                      <ThemedText style={s.planFilledText}>{wp.name}</ThemedText>
                      <Pressable onPress={() => removeWaypoint(idx)}>
                        <ThemedText style={s.planRemoveBtn}>✕</ThemedText>
                      </Pressable>
                    </View>
                  ))}

                  {currentPlan.waypoints.length === 0 && (
                    <Pressable onPress={() => openSearch('waypoint')} style={s.planEmptyBox}>
                      <ThemedText style={s.planEmptyText}>중간 경로를 추가해주세요.</ThemedText>
                    </Pressable>
                  )}
                </View>

                {/* 도착지 */}
                <View style={s.planSection}>
                  <View style={s.planLabelRow}>
                    <ThemedText style={s.planLabel}>도착지</ThemedText>
                    <ThemedText style={s.planRequired}>*</ThemedText>
                  </View>
                  {currentPlan.end ? (
                    <View style={s.planFilledBox}>
                      <ThemedText style={s.planFilledText}>{currentPlan.end.name}</ThemedText>
                      <Pressable onPress={() => removePlace('end')}>
                        <ThemedText style={s.planRemoveBtn}>✕</ThemedText>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable onPress={() => openSearch('end')} style={s.planEmptyBox}>
                      <ThemedText style={s.planEmptyText}>도착지를 추가해주세요.</ThemedText>
                    </Pressable>
                  )}
                </View>

                {/* 저장하기 */}
                <Pressable
                  style={({ pressed }) => [s.saveBtn, pressed && s.pressed]}
                >
                  <ThemedText style={s.saveBtnText}>저장하기</ThemedText>
                </Pressable>
              </View>
            )}
          </ThemedView>
        </ScrollView>
      )}

      {searchModalVisible && selectedRoute && (
        <PlaceSearchModal
          courseType={THEME_TO_COURSE_TYPE[selectedRoute.theme || '일반'] || 'GENERAL'}
          onSelectPlace={selectPlace}
          onClose={closeSearch}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
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
  },
  stepContainer: {
    alignSelf: 'stretch',
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },

  // ── List Screen (디자인 1번) ──
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222222',
  },
  mailIcon: {
    padding: 4,
  },
  routeList: {
    paddingHorizontal: Spacing.four,
    gap: 12,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 6,
  },
  routeCardTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  routeCardDate: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  routeCardBadge: {
    backgroundColor: '#E06635',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  routeCardBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  routeCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
  },
  routeCardDesc: {
    fontSize: 13,
    color: '#999999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  createBtn: {
    backgroundColor: '#E06635',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  // ── Detail Screen (디자인 2번) ──
  detailHeaderRow: {
    paddingHorizontal: Spacing.four,
  },
  detailTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222222',
  },
  inviteBtn: {
    backgroundColor: '#E59341',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  inviteBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  detailSummaryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: Spacing.four,
    gap: 6,
  },
  detailSummaryTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  detailSummaryDate: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  detailSummaryBadge: {
    backgroundColor: '#E06635',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detailSummaryBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  detailSummaryDesc: {
    fontSize: 14,
    color: '#666666',
  },

  // Day Tabs
  dayTabsRow: {
    paddingHorizontal: Spacing.four,
    marginVertical: Spacing.one,
  },
  dayTabsContent: {
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayTabActive: {
    backgroundColor: '#E59341',
    borderColor: '#E59341',
  },
  dayTabText: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '600',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Plan Sections
  planSection: {
    paddingHorizontal: Spacing.four,
    gap: 8,
  },
  planLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  planLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222222',
  },
  planRequired: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E06635',
  },
  planChevron: {
    fontSize: 16,
    color: '#999999',
    marginLeft: 2,
  },
  planEmptyBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  planEmptyText: {
    fontSize: 14,
    color: '#C0C0C0',
  },
  planFilledBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  planFilledText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
  },
  planRemoveBtn: {
    fontSize: 14,
    color: '#AAAAAA',
    padding: 4,
  },

  // Save Button
  saveBtn: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
