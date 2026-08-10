import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useDayPlanning } from '@/hooks/use-day-planning';
import { useTheme } from '@/hooks/use-theme';
import { type RoutePlace, useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DayPlanningStep } from './DayPlanningStep';
import { PlaceSearchModal } from './PlaceSearchModal';
import { THEME_TO_COURSE_TYPE } from './constants';

type StepType = 'list' | 'details';

export default function RouteScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const { savedRoutes, updateRouteItinerary, deleteRoute } = useRouteStore();

  const {
    searchModalVisible,
    dayPlans,
    setSelectedRouteId: setStoreRouteId,
    closeSearch,
    selectPlace,
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

  const handleSaveRoute = () => {
    if (!selectedRouteId) return;

    const newItinerary: RoutePlace[] = [];
    Object.entries(dayPlans).forEach(([dayIdxStr, plan]) => {
      const day = parseInt(dayIdxStr, 10);
      if (plan.start) {
        newItinerary.push({ ...plan.start, day, type: 'start' });
      }
      plan.waypoints.forEach((wp) => {
        newItinerary.push({ ...wp, day, type: 'waypoint' });
      });
      if (plan.end) {
        newItinerary.push({ ...plan.end, day, type: 'end' });
      }
    });

    updateRouteItinerary(selectedRouteId, newItinerary);

    if (Platform.OS === 'web') {
      window.alert('여행 일정이 저장되었습니다.');
    } else {
      Alert.alert('성공', '여행 일정이 저장되었습니다.');
    }
    setStep('list');
  };

  const handleDeleteRoute = (id: string, name: string) => {
    const doDelete = () => {
      deleteRoute(id);
      if (selectedRouteId === id) {
        setSelectedRouteId(null);
        setStep('list');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`'${name}' 여행을 삭제하시겠습니까?`)) {
        doDelete();
      }
    } else {
      Alert.alert('여행 삭제', `'${name}' 여행을 삭제하시겠습니까?`, [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

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
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDeleteRoute(route.id, route.name);
                          }}
                          hitSlop={8}
                        >
                          <ThemedText style={s.deleteBtnText}>삭제</ThemedText>
                        </Pressable>
                        <View style={s.routeCardRightHeader}>
                          <ThemedText style={s.routeCardDate}>
                            {route.dates.replace(/\./g, '/')}
                          </ThemedText>
                          <View style={s.routeCardBadge}>
                            <ThemedText style={s.routeCardBadgeText}>
                              {route.theme || '일반'}
                            </ThemedText>
                          </View>
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

            {/* ── STEP 2: 상세보기 ── */}
            {step === 'details' && selectedRoute && (
              <DayPlanningStep
                title="여행 상세"
                routeName={selectedRoute.name}
                routeDates={selectedRoute.dates}
                selectedCompanion={selectedRoute.companion || selectedRoute.tags?.[1] || '혼자'}
                daysList={daysList}
                month={month}
                onBack={() => setStep('list')}
                onSave={handleSaveRoute}
              />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  routeCardRightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtnText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
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
