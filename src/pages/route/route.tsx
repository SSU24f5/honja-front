import {
  type CourseDetailResponseDto,
  type CourseListResponseDto,
  type UpdateCourseDateItemDto,
  type UpdateCoursePlaceItemDto,
  getCourseDetail,
  getCourses,
  updateCoursePlaces,
} from '@/api/course';
import { AppIcon } from '@/components/common/AppIcon';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useDayPlanning } from '@/hooks/use-day-planning';
import { useTheme } from '@/hooks/use-theme';
import { useDayPlanningStore } from '@/stores/dayPlanningStore';
import { type RoutePlace, type SavedRoute, useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/styles/theme';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import type { DayPlan } from './constants';
import { THEME_TO_COURSE_TYPE } from './constants';
import { DayPlanningStep } from './DayPlanningStep';
import { PlaceOptionItem, PlaceRecommendationModal } from './PlaceRecommendationModal';
import { PlaceSearchModal } from './PlaceSearchModal';
import { RouteRecommendationModal } from './RouteRecommendationModal';
import { WaypointManagementScreen } from './WaypointManagementScreen';

type StepType = 'list' | 'details' | 'waypoints';

function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate || !endDate) return '';
  const formatSingleDate = (d: string) => {
    const parts = d.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`;
    }
    const dotParts = d.replace(/\.$/, '').split('.');
    if (dotParts.length >= 2) {
      const month = dotParts[dotParts.length - 2];
      const day = dotParts[dotParts.length - 1];
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
    }
    return d;
  };
  return `${formatSingleDate(startDate)} ~ ${formatSingleDate(endDate)}`;
}

function formatDateFormatted(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('~');
  if (parts.length === 2) {
    const formatPart = (p: string) => {
      const cleaned = p.trim().replace(/\.$/, '').replace(/\./g, '/');
      const tokens = cleaned.split('/');
      if (tokens.length === 3) {
        return `${tokens[1]}/${tokens[2]}`;
      }
      if (tokens.length === 2) {
        return `${tokens[0]}/${tokens[1]}`;
      }
      return cleaned;
    };
    return `${formatPart(parts[0])} ~ ${formatPart(parts[1])}`;
  }
  return dateStr;
}

function getCourseTypeLabel(type?: string): string {
  switch (type) {
    case 'GENERAL':
      return '일반';
    case 'BARRIER_FREE':
      return '배리어프리';
    case 'PET':
      return '반려동물';
    default:
      return type || '일반';
  }
}

function convertCourseDetailToDayPlans(detail: CourseDetailResponseDto): Record<number, DayPlan> {
  const plans: Record<number, DayPlan> = {};

  (detail.dates || []).forEach((dateObj, dayIdx) => {
    let start: RoutePlace | null = null;
    let end: RoutePlace | null = null;
    const waypoints: RoutePlace[] = [];

    const sortedPlaces = [...(dateObj.places || [])].sort((a, b) => a.order - b.order);

    sortedPlaces.forEach((cp) => {
      const place: RoutePlace = {
        id: String(cp.coursePlaceId || cp.placeId || cp.contentId),
        coursePlaceId: cp.coursePlaceId,
        placeId: cp.placeId,
        contentId: cp.contentId,
        contentTypeId: cp.contentTypeId,
        cat3: cp.cat3,
        isPetPlace: cp.isPetPlace,
        isBarrierFree: cp.isBarrierFree,
        mapx: cp.mapx,
        mapy: cp.mapy,
        placeType: cp.placeType || 'TOUR_PLACE',
        title: cp.title,
        name: cp.title || '장소',
        category:
          cp.cat3 ||
          (cp.orderType === 'START' ? '출발지' : cp.orderType === 'END' ? '도착지' : '관광지'),
        address: cp.title,
        image: cp.image,
        day: dayIdx,
        type: cp.orderType === 'START' ? 'start' : cp.orderType === 'END' ? 'end' : 'waypoint',
      };

      if (cp.orderType === 'START') {
        start = place;
      } else if (cp.orderType === 'END') {
        end = place;
      } else {
        waypoints.push(place);
      }
    });

    plans[dayIdx] = { start, waypoints, end };
  });

  return plans;
}

export default function RouteScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const { savedRoutes, updateRouteItinerary, deleteRoute } = useRouteStore();

  // GET /courses API 연동 (목록)
  const { data: apiCourses = [], isLoading } = useQuery<CourseListResponseDto[]>({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const [step, setStep] = useState<StepType>('list');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [recommendationModalVisible, setRecommendationModalVisible] = useState(false);
  const [routeRecommendationModalVisible, setRouteRecommendationModalVisible] = useState(false);

  const {
    searchModalVisible,
    dayPlans,
    currentPlan,
    setSelectedRouteId: setStoreRouteId,
    closeSearch,
    selectPlace,
    openSearch,
    removeWaypoint,
    moveWaypointUp,
    moveWaypointDown,
    reorderWaypoints,
  } = useDayPlanning();

  // GET /courses/{courseId} API 연동 (상세 코스 정보 및 일별 장소들)
  const numericRouteId = parseInt(selectedRouteId?.replace(/\D/g, '') || '0', 10);
  const { data: courseDetail } = useQuery<CourseDetailResponseDto>({
    queryKey: ['courseDetail', numericRouteId],
    queryFn: () => getCourseDetail(numericRouteId),
    enabled: !!selectedRouteId && numericRouteId > 0 && step !== 'list',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset selected tab on route change
  useEffect(() => {
    setStoreRouteId(selectedRouteId);
  }, [selectedRouteId]);

  // API 상세 코스 데이터를 받아왔을 때 dayPlans 스토어에 장소 데이터 자동 세팅
  useEffect(() => {
    if (courseDetail && courseDetail.dates && courseDetail.dates.length > 0) {
      const plans = convertCourseDetailToDayPlans(courseDetail);
      useDayPlanningStore.setState({ dayPlans: plans });
    }
  }, [courseDetail]);

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

  const selectedRoute = useMemo(() => {
    if (courseDetail) {
      let duration = '';
      if (courseDetail.startDate && courseDetail.endDate) {
        const start = new Date(courseDetail.startDate);
        const end = new Date(courseDetail.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        duration = `${diffDays}박 ${diffDays + 1}일`;
      }

      const formattedDates =
        courseDetail.startDate && courseDetail.endDate
          ? `${courseDetail.startDate.replace(/-/g, '.')} ~ ${courseDetail.endDate.replace(/-/g, '.')}`
          : '';

      return {
        id: String(courseDetail.courseId),
        name: courseDetail.name,
        dates: formattedDates,
        duration,
        tags: [getCourseTypeLabel(courseDetail.courseType)],
        theme: getCourseTypeLabel(courseDetail.courseType),
        companion: '혼자',
        description: courseDetail.description,
        itinerary: [],
      } as SavedRoute;
    }

    // 1. Check local savedRoutes first
    const saved = savedRoutes.find((r) => r.id === selectedRouteId);
    if (saved) return saved;

    // 2. Fallback to API courses
    const apiCourse = apiCourses.find((c) => String(c.id) === selectedRouteId);
    if (apiCourse) {
      let duration = '';
      if (apiCourse.startDate && apiCourse.endDate) {
        const start = new Date(apiCourse.startDate);
        const end = new Date(apiCourse.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        duration = `${diffDays}박 ${diffDays + 1}일`;
      }

      const formattedDates =
        apiCourse.startDate && apiCourse.endDate
          ? `${apiCourse.startDate.replace(/-/g, '.')} ~ ${apiCourse.endDate.replace(/-/g, '.')}`
          : '';

      return {
        id: String(apiCourse.id),
        name: apiCourse.name,
        dates: formattedDates,
        duration,
        tags: [getCourseTypeLabel(apiCourse.courseType)],
        theme: getCourseTypeLabel(apiCourse.courseType),
        companion: '혼자',
        description: apiCourse.description,
        itinerary: [],
      } as SavedRoute;
    }

    return null;
  }, [courseDetail, savedRoutes, apiCourses, selectedRouteId]);

  // Parse days from selected route dates
  const { daysList, month } = useMemo(() => {
    if (!selectedRoute || !selectedRoute.dates) return { daysList: [1], month: 8 };
    try {
      const parts = selectedRoute.dates.split('~');
      const startParts = parts[0].trim().split(/[\.-]/);
      const endParts = (parts[1] || parts[0]).trim().split(/[\.-]/);
      const sDay = parseInt(startParts[startParts.length - 1], 10);
      const eDay = parseInt(endParts[endParts.length - 1], 10);
      const m = parseInt(startParts[startParts.length - 2], 10);
      const list = [];
      if (!isNaN(sDay) && !isNaN(eDay) && sDay <= eDay) {
        for (let d = sDay; d <= eDay; d++) {
          list.push(d);
        }
      } else if (!isNaN(sDay)) {
        list.push(sDay);
      }
      return { daysList: list.length > 0 ? list : [1], month: isNaN(m) ? 8 : m };
    } catch {
      return { daysList: [1], month: 8 };
    }
  }, [selectedRoute]);

  const handleSaveRoute = async () => {
    if (!selectedRouteId) return;

    const newItinerary: RoutePlace[] = [];
    const datesPayload: UpdateCourseDateItemDto[] = [];

    const startDateStr = selectedRoute?.dates?.split('~')[0]?.trim();

    const parsePlaceToItem = (
      p: RoutePlace,
      order: number,
      orderType: string,
    ): UpdateCoursePlaceItemDto => {
      const item: UpdateCoursePlaceItemDto = {
        order,
        orderType,
        title: p.title || p.name || '장소',
        contentId: String(p.contentId || p.id || '126006'),
        contentTypeId: String(
          p.contentTypeId || (p.category && /^\d+$/.test(p.category) ? p.category : '12'),
        ),
        mapx: String(p.mapx || '126.9780'),
        mapy: String(p.mapy || '37.5665'),
        image: p.image || '',
        placeType: p.placeType || 'TOUR_PLACE',
      };

      if (p.cat3) {
        item.cat3 = p.cat3;
      }
      if (typeof p.isPetPlace === 'boolean') {
        item.isPetPlace = p.isPetPlace;
      }
      if (typeof p.isBarrierFree === 'boolean') {
        item.isBarrierFree = p.isBarrierFree;
      }

      if (p.coursePlaceId) {
        item.coursePlaceId = p.coursePlaceId;
      }
      if (p.placeId) {
        item.placeId = p.placeId;
      }

      return item;
    };

    Object.entries(dayPlans).forEach(([dayIdxStr, plan]) => {
      const day = parseInt(dayIdxStr, 10);
      const dayPlaces: UpdateCoursePlaceItemDto[] = [];
      let orderCounter = 0;

      if (plan.start) {
        newItinerary.push({ ...plan.start, day, type: 'start' });
        dayPlaces.push(parsePlaceToItem(plan.start, orderCounter++, 'START'));
      }
      plan.waypoints.forEach((wp) => {
        newItinerary.push({ ...wp, day, type: 'waypoint' });
        dayPlaces.push(parsePlaceToItem(wp, orderCounter++, 'WAYPOINT'));
      });
      if (plan.end) {
        newItinerary.push({ ...plan.end, day, type: 'end' });
        dayPlaces.push(parsePlaceToItem(plan.end, orderCounter++, 'END'));
      }

      if (dayPlaces.length > 0) {
        const dateStr = (() => {
          const today = new Date();
          const pad = (n: number) => String(n).padStart(2, '0');
          if (!startDateStr) {
            const d = new Date(today);
            d.setDate(today.getDate() + day);
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
          }
          const tokens = startDateStr.replace(/\./g, '-').split('-');
          if (tokens.length === 3) {
            const year = parseInt(tokens[0].length === 4 ? tokens[0] : `20${tokens[0]}`, 10);
            const month = parseInt(tokens[1], 10) - 1;
            const dNum = parseInt(tokens[2], 10);
            const d = new Date(year, month, dNum + day);
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
          }
          return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        })();

        datesPayload.push({
          date: dateStr,
          places: dayPlaces,
        });
      }
    });

    const numericCourseId = parseInt(selectedRouteId.replace(/\D/g, ''), 10);

    try {
      if (!isNaN(numericCourseId) && numericCourseId > 0 && datesPayload.length > 0) {
        await updateCoursePlaces({
          courseId: numericCourseId,
          dates: datesPayload,
        });
      }

      const exists = savedRoutes.some((r) => r.id === selectedRouteId);
      if (exists) {
        updateRouteItinerary(selectedRouteId, newItinerary);
      } else if (selectedRoute) {
        useRouteStore.setState((state) => ({
          savedRoutes: [...state.savedRoutes, { ...selectedRoute, itinerary: newItinerary }],
        }));
      }

      if (Platform.OS === 'web') {
        window.alert('여행 일정이 성공적으로 저장되었습니다.');
      } else {
        Alert.alert('성공', '여행 일정이 성공적으로 저장되었습니다.');
      }
      setStep('list');
    } catch (err) {
      console.log('[PUT /courses Error]', err);
      const msg = err instanceof Error ? err.message : '일정 저장 중 오류가 발생했습니다.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('오류', msg);
      }
    }
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

  // 렌더링할 코스 데이터 (API 데이터를 최우선 사용, 데이터가 없을 시 로컬 로컬 스토어 데이터 폴백 사용)
  const hasApiCourses = apiCourses && apiCourses.length > 0;

  const availablePlacesForModal: PlaceOptionItem[] = useMemo(() => {
    const list: PlaceOptionItem[] = [];
    if (currentPlan.start) {
      list.push({
        id: currentPlan.start.id,
        name: currentPlan.start.name,
        tag: '출발지',
      });
    }
    currentPlan.waypoints.forEach((wp, idx) => {
      list.push({
        id: wp.id,
        name: wp.name,
        tag: `중간 ${idx + 1}`,
      });
    });
    if (currentPlan.end) {
      list.push({
        id: currentPlan.end.id,
        name: currentPlan.end.name,
        tag: '도착지',
      });
    }
    return list;
  }, [currentPlan]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      {!searchModalVisible && step === 'waypoints' && selectedRoute && (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <WaypointManagementScreen
            routeName={selectedRoute.name}
            waypoints={currentPlan.waypoints}
            onBack={() => setStep('details')}
            onAddWaypoint={() => openSearch('waypoint')}
            onReorderWaypoints={reorderWaypoints}
            onOpenRecommendation={() => setRecommendationModalVisible(true)}
            onOpenRouteRecommendation={() => {
              if (!currentPlan.start || !currentPlan.end) {
                const msg = '경로 순서 추천을 받으려면 출발지(*)와 도착지(*)를 먼저 등록해 주세요.';
                if (Platform.OS === 'web') window.alert(msg);
                else Alert.alert('알림', msg);
                return;
              }
              setRouteRecommendationModalVisible(true);
            }}
          />
        </View>
      )}

      {!searchModalVisible && step !== 'waypoints' && (
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
                  <Pressable
                    style={s.mailIcon}
                    onPress={() => router.push('/invitation' as any)}
                    hitSlop={8}
                  >
                    <AppIcon name="envelope" size={24} color="#FF9B29" />
                  </Pressable>
                </View>

                {/* Route Cards */}
                <View style={s.routeList}>
                  {isLoading && (
                    <View style={s.loadingContainer}>
                      <ActivityIndicator size="large" color="#FF6623" />
                    </View>
                  )}

                  {!isLoading &&
                    hasApiCourses &&
                    apiCourses.map((course) => (
                      <Pressable
                        key={course.id}
                        onPress={() => {
                          setSelectedRouteId(String(course.id));
                          setStep('details');
                        }}
                        style={({ pressed }) => [s.routeCard, pressed && s.pressed]}
                      >
                        <View style={s.routeCardTopHeader}>
                          <View style={s.routeCardBadgesContainer}>
                            <View style={s.routeCardDateBadge}>
                              <ThemedText style={s.routeCardDateText} numberOfLines={1}>
                                {formatDateRange(course.startDate, course.endDate)}
                              </ThemedText>
                            </View>
                            <View style={s.routeCardBadge}>
                              <ThemedText style={s.routeCardBadgeText} numberOfLines={1}>
                                {getCourseTypeLabel(course.courseType)}
                              </ThemedText>
                            </View>
                          </View>
                        </View>
                        <ThemedText style={s.routeCardName}>{course.name}</ThemedText>
                        {course.description ? (
                          <ThemedText style={s.routeCardDesc}>{course.description}</ThemedText>
                        ) : null}
                      </Pressable>
                    ))}

                  {!isLoading &&
                    !hasApiCourses &&
                    savedRoutes.length > 0 &&
                    savedRoutes.map((route) => (
                      <Pressable
                        key={route.id}
                        onPress={() => {
                          setSelectedRouteId(route.id);
                          setStep('details');
                        }}
                        style={({ pressed }) => [s.routeCard, pressed && s.pressed]}
                      >
                        <View style={s.routeCardTopHeader}>
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDeleteRoute(route.id, route.name);
                            }}
                            hitSlop={8}
                          >
                            <ThemedText style={s.deleteBtnText}>삭제</ThemedText>
                          </Pressable>
                          <View style={s.routeCardBadgesContainer}>
                            <View style={s.routeCardDateBadge}>
                              <ThemedText style={s.routeCardDateText} numberOfLines={1}>
                                {formatDateFormatted(route.dates)}
                              </ThemedText>
                            </View>
                            <View style={s.routeCardBadge}>
                              <ThemedText style={s.routeCardBadgeText} numberOfLines={1}>
                                {route.theme || '일반'}
                              </ThemedText>
                            </View>
                          </View>
                        </View>
                        <ThemedText style={s.routeCardName}>{route.name}</ThemedText>
                        {route.description ? (
                          <ThemedText style={s.routeCardDesc}>{route.description}</ThemedText>
                        ) : route.itinerary.length > 0 ? (
                          <ThemedText style={s.routeCardDesc}>
                            {route.itinerary.map((p) => p.name).join(' → ')}
                          </ThemedText>
                        ) : null}
                      </Pressable>
                    ))}

                  {!isLoading && !hasApiCourses && savedRoutes.length === 0 && (
                    <View style={s.emptyState}>
                      <ThemedText style={s.emptyStateText}>아직 생성된 여행이 없습니다.</ThemedText>
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

            {/* ── STEP 2: 상세보기 (3번째 사진 - 여행_상세보기) ── */}
            {step === 'details' && selectedRoute && (
              <DayPlanningStep
                title="여행 상세"
                routeName={selectedRoute.name}
                routeDates={formatDateFormatted(selectedRoute.dates)}
                selectedCompanion={selectedRoute.companion || selectedRoute.tags?.[1] || '혼자'}
                daysList={daysList}
                month={month}
                onBack={() => setStep('list')}
                onSave={handleSaveRoute}
                onOpenWaypoints={() => setStep('waypoints')}
              />
            )}
          </ThemedView>
        </ScrollView>
      )}

      {/* ── 장소 추천 받기 모달 (1번째 사진 - 여행_장소 추천 받기) ── */}
      <PlaceRecommendationModal
        visible={recommendationModalVisible}
        courseType={
          selectedRoute
            ? THEME_TO_COURSE_TYPE[selectedRoute.theme || '일반'] || 'GENERAL'
            : 'GENERAL'
        }
        availablePlaces={availablePlacesForModal}
        onClose={() => setRecommendationModalVisible(false)}
        onAddRecommendedPlaces={(recommendedPlaces) => {
          const newPlaces: RoutePlace[] = recommendedPlaces.map((rec) => ({
            id: rec.contentid || String(Date.now() + Math.random()),
            name: rec.title,
            category: '추천',
            address: rec.addr1 || rec.addr2 || '추천 장소',
            image: rec.firstimage || rec.firstimage2,
          }));
          useDayPlanningStore.getState().addRecommendedWaypoints(newPlaces);
        }}
      />

      {/* ── 경로 추천 받기 모달 (경로 순서 추천 API 연동) ── */}
      <RouteRecommendationModal
        visible={routeRecommendationModalVisible}
        courseId={parseInt(selectedRouteId?.replace(/\D/g, '') || '1', 10)}
        date={(() => {
          const today = new Date();
          const pad = (n: number) => String(n).padStart(2, '0');
          if (!selectedRoute?.dates) {
            return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
          }
          const firstPart = selectedRoute.dates.split('~')[0].trim().replace(/\.$/, '');
          const tokens = firstPart.split(/[\.-]/);
          if (tokens.length === 3) {
            const year = tokens[0].length === 4 ? tokens[0] : `20${tokens[0]}`;
            return `${year}-${pad(parseInt(tokens[1], 10))}-${pad(parseInt(tokens[2], 10))}`;
          }
          return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        })()}
        startPlace={currentPlan.start}
        endPlace={currentPlan.end}
        currentWaypoints={currentPlan.waypoints}
        onClose={() => setRouteRecommendationModalVisible(false)}
        onApplyRouteOrder={(orderedWaypoints) => {
          useDayPlanningStore.getState().reorderWaypoints(orderedWaypoints);
        }}
      />

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
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  routeCardTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  deleteBtnText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
  },
  routeCardBadgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    flexShrink: 1,
    marginLeft: 'auto',
  },
  routeCardDateBadge: {
    backgroundColor: '#EAECEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 1,
  },
  routeCardDateText: {
    fontSize: 12,
    color: '#60646C',
    fontWeight: '500',
  },
  routeCardBadge: {
    backgroundColor: '#91A267',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 0,
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
    color: '#60646C',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
    backgroundColor: '#FF6623',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
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
