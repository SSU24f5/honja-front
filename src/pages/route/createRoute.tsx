import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { type RoutePlace, useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/styles/theme';

type StepType = 'basic_info' | 'day_planning';

const THEME_CATEGORIES = ['일반', '배리어프리', '반려동물'];
const COMPANION_CATEGORIES = ['혼자', '가족과 함께', '친구와 함께', '애인과 함께', '그 외'];

const PREDEFINED_PLACES: RoutePlace[] = [
  {
    id: 'place-abebe',
    name: '아베베 베이커리',
    category: '일반',
    address: '제주 제주시 동문로6길 4 1-3층(일도일동)',
  },
  {
    id: 'place-ebebe',
    name: '으브브 베이커리',
    category: '반려동물',
    address: '제주 제주시 동문로6길 4 1-3층(일도일동)',
  },
  { id: 'place-airport', name: '제주국제공항', category: '교통', address: '제주 공항로 2' },
  { id: 'place-hamdeok', name: '함덕 해수욕장', category: '관광지', address: '제주 조천읍 함덕리' },
  {
    id: 'place-ecoland',
    name: '에코랜드 테마파크',
    category: '관광지',
    address: '제주 번영로 1278-169',
  },
  {
    id: 'place-osulloc',
    name: '오설록 티 뮤지엄',
    category: '체험',
    address: '제주 안덕면 신화역사로 15',
  },
  { id: 'place-gwakji', name: '곽지 해수욕장', category: '관광지', address: '제주 애월읍 곽지리' },
  { id: 'place-udo', name: '우도 도항선 선착장', category: '교통', address: '제주 우도면' },
  { id: 'place-sungsan', name: '성산일출봉', category: '관광지', address: '제주 성산읍 성산리 1' },
  {
    id: 'place-hallasan',
    name: '한라산 국립공원',
    category: '관광지',
    address: '제주 오등동 산 220-1',
  },
  {
    id: 'place-hyeopjae',
    name: '협재 해수욕장',
    category: '관광지',
    address: '제주 한림읍 협재리 2497-1',
  },
  { id: 'place-cheonjeyeon', name: '천제연 폭포', category: '관광지', address: '제주 중문동 2232' },
  { id: 'place-seopjikoji', name: '섭지코지', category: '관광지', address: '제주 성산읍 고성리' },
];

export default function CreateRouteScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const { setItinerary, createRoute } = useRouteStore();

  // Basic Info States
  const [step, setStep] = useState<StepType>('basic_info');
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('일반');
  const [selectedCompanion, setSelectedCompanion] = useState('혼자');
  const [showCalendar, setShowCalendar] = useState(true);
  // Dynamic Date Setup (Today ~ Tomorrow)
  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);
  const padDate = (n: number) => (n < 10 ? `0${n}` : n);

  const [startDate, setStartDate] = useState<number | null>(today.getDate());
  const [endDate, setEndDate] = useState<number | null>(tomorrow.getDate());
  const [routeDates, setRouteDates] = useState(
    `26.07.${padDate(today.getDate())} ~ 26.07.${padDate(tomorrow.getDate())}`,
  );

  // Day-by-Day Planner States
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [dayPlans, setDayPlans] = useState<
    Record<
      number,
      {
        start: RoutePlace | null;
        waypoints: RoutePlace[];
        end: RoutePlace | null;
      }
    >
  >({});

  // Search Modal States
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTarget, setSearchTarget] = useState<{
    dayIndex: number;
    type: 'start' | 'waypoint' | 'end';
    waypointIndex?: number;
  } | null>(null);
  const [selectedPlaceToConfirm, setSelectedPlaceToConfirm] = useState<RoutePlace | null>(null);

  useEffect(() => {
    if (!searchModalVisible) return;
    const backAction = () => {
      setSearchModalVisible(false);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [searchModalVisible]);

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

  // Calculate Dates and Duration
  const durationText = useMemo(() => {
    if (startDate === null) return '';
    if (endDate === null) return '당일치기';
    const nights = endDate - startDate;
    const days = nights + 1;
    return `${nights}박 ${days}일`;
  }, [startDate, endDate]);

  const daysList = useMemo(() => {
    if (startDate === null) return [];
    if (endDate === null) return [startDate];
    const list = [];
    for (let d = startDate; d <= endDate; d++) {
      list.push(d);
    }
    return list;
  }, [startDate, endDate]);

  // Reset selected day when dates change
  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset selected tab index on date selection change
  useEffect(() => {
    setSelectedDayIdx(0);
  }, [startDate, endDate]);

  const handleDayPress = (day: number) => {
    if (startDate === null || endDate !== null) {
      setStartDate(day);
      setEndDate(null);
      setRouteDates(`26.07.${day < 10 ? `0${day}` : day}`);
    } else {
      if (day < startDate) {
        setStartDate(day);
        setRouteDates(`26.07.${day < 10 ? `0${day}` : day}`);
      } else {
        setEndDate(day);
        setRouteDates(
          `26.07.${startDate < 10 ? `0${startDate}` : startDate} ~ 26.07.${day < 10 ? `0${day}` : day}`,
        );
      }
    }
  };

  const currentPlan = useMemo(() => {
    return dayPlans[selectedDayIdx] || { start: null, waypoints: [], end: null };
  }, [dayPlans, selectedDayIdx]);

  const openSearch = (type: 'start' | 'waypoint' | 'end', waypointIndex?: number) => {
    setSearchTarget({ dayIndex: selectedDayIdx, type, waypointIndex });
    setSearchQuery('');
    setSelectedPlaceToConfirm(null);
    setSearchModalVisible(true);
  };

  const handleSelectPlace = (place: RoutePlace) => {
    if (!searchTarget) return;
    const { dayIndex, type, waypointIndex } = searchTarget;

    setDayPlans((prev) => {
      const existing = prev[dayIndex] || { start: null, waypoints: [], end: null };
      if (type === 'start') {
        return { ...prev, [dayIndex]: { ...existing, start: place } };
      } else if (type === 'end') {
        return { ...prev, [dayIndex]: { ...existing, end: place } };
      } else {
        if (typeof waypointIndex === 'number') {
          const updatedWaypoints = [...existing.waypoints];
          updatedWaypoints[waypointIndex] = place;
          return {
            ...prev,
            [dayIndex]: { ...existing, waypoints: updatedWaypoints },
          };
        } else {
          // Prevent duplicate waypoints
          if (existing.waypoints.some((wp) => wp.id === place.id)) return prev;
          return {
            ...prev,
            [dayIndex]: { ...existing, waypoints: [...existing.waypoints, place] },
          };
        }
      }
    });

    setSearchModalVisible(false);
    setSearchTarget(null);
    setSelectedPlaceToConfirm(null);
  };

  const handleRemovePlace = (type: 'start' | 'end') => {
    setDayPlans((prev) => {
      const existing = prev[selectedDayIdx] || { start: null, waypoints: [], end: null };
      if (type === 'start') {
        return { ...prev, [selectedDayIdx]: { ...existing, start: null } };
      } else if (type === 'end') {
        return { ...prev, [selectedDayIdx]: { ...existing, end: null } };
      }
      return prev;
    });
  };

  const handleRemoveWaypoint = (index: number) => {
    setDayPlans((prev) => {
      const existing = prev[selectedDayIdx] || { start: null, waypoints: [], end: null };
      const updatedWaypoints = [...existing.waypoints];
      updatedWaypoints.splice(index, 1);
      return {
        ...prev,
        [selectedDayIdx]: { ...existing, waypoints: updatedWaypoints },
      };
    });
  };

  const handleMoveWaypointUp = (index: number) => {
    if (index === 0) return;
    setDayPlans((prev) => {
      const existing = prev[selectedDayIdx] || { start: null, waypoints: [], end: null };
      const updatedWaypoints = [...existing.waypoints];
      const temp = updatedWaypoints[index];
      updatedWaypoints[index] = updatedWaypoints[index - 1];
      updatedWaypoints[index - 1] = temp;
      return {
        ...prev,
        [selectedDayIdx]: { ...existing, waypoints: updatedWaypoints },
      };
    });
  };

  const handleMoveWaypointDown = (index: number) => {
    setDayPlans((prev) => {
      const existing = prev[selectedDayIdx] || { start: null, waypoints: [], end: null };
      if (index >= existing.waypoints.length - 1) return prev;
      const updatedWaypoints = [...existing.waypoints];
      const temp = updatedWaypoints[index];
      updatedWaypoints[index] = updatedWaypoints[index + 1];
      updatedWaypoints[index + 1] = temp;
      return {
        ...prev,
        [selectedDayIdx]: { ...existing, waypoints: updatedWaypoints },
      };
    });
  };

  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return PREDEFINED_PLACES;
    return PREDEFINED_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleAddCustomPlace = () => {
    if (!searchQuery.trim()) return;
    const customPlace: RoutePlace = {
      id: `custom-${Date.now()}`,
      name: searchQuery.trim(),
      category: '직접입력',
      address: '제주특별자치도',
    };
    handleSelectPlace(customPlace);
  };

  const isFormValid = routeName.trim() !== '' && startDate !== null && endDate !== null;

  const isSaveEnabled = useMemo(() => {
    if (!routeName.trim()) return false;
    if (startDate === null || endDate === null) return false;
    if (daysList.length === 0) return false;

    // Check if each day has a start and end point
    for (let i = 0; i < daysList.length; i++) {
      const plan = dayPlans[i];
      if (!plan?.start || !plan?.end) return false;
    }
    return true;
  }, [routeName, startDate, endDate, daysList, dayPlans]);

  const handleSaveRoute = () => {
    if (!isSaveEnabled) return;

    // Compile day-by-day plans into a flat list
    const compiledItinerary: RoutePlace[] = [];

    daysList.forEach((_, idx) => {
      const plan = dayPlans[idx];
      if (plan) {
        if (plan.start) {
          compiledItinerary.push({
            ...plan.start,
            day: idx,
            type: 'start',
          });
        }
        plan.waypoints.forEach((wp) => {
          compiledItinerary.push({
            ...wp,
            day: idx,
            type: 'waypoint',
          });
        });
        if (plan.end) {
          compiledItinerary.push({
            ...plan.end,
            day: idx,
            type: 'end',
          });
        }
      }
    });

    setItinerary(compiledItinerary);
    createRoute(routeName, routeDates, durationText, selectedTheme, selectedCompanion);

    const msg = '새로운 여행 경로가 성공적으로 생성되었습니다!';
    if (Platform.OS === 'web') window.alert(msg);
    else Alert.alert('성공', msg);

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      {!searchModalVisible && (
        <ScrollView
          style={[styles.scrollView, { backgroundColor: theme.backgroundElement }]}
          contentInset={insets}
          contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
        >
          <ThemedView style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
            {/* STEP 1: BASIC INFO */}
            {step === 'basic_info' && (
              <View style={styles.formPageContainer}>
                <View style={styles.formHeader}>
                  <ThemedText style={styles.formTitle}>여행 생성하기</ThemedText>
                </View>

                <View style={styles.formBody}>
                  {/* 여행 이름 */}
                  <View style={styles.formItem}>
                    <View style={styles.labelRow}>
                      <ThemedText style={styles.formLabel}>여행 이름</ThemedText>
                      <ThemedText style={styles.requiredAsterisk}> *</ThemedText>
                    </View>
                    <TextInput
                      value={routeName}
                      onChangeText={setRouteName}
                      style={[
                        styles.whiteInput,
                        routeName
                          ? { color: Colors.light.titleColor }
                          : { color: Colors.light.hintText },
                      ]}
                      placeholder="여행 이름을 지어주세요."
                      placeholderTextColor={Colors.light.hintText}
                    />
                  </View>

                  {/* 여행 날짜 */}
                  <View style={styles.formItem}>
                    <View style={styles.labelRow}>
                      <ThemedText style={styles.formLabel}>여행 날짜</ThemedText>
                      <ThemedText style={styles.requiredAsterisk}> *</ThemedText>
                    </View>
                    <Pressable onPress={() => setShowCalendar(!showCalendar)}>
                      <TextInput
                        value={routeDates + (durationText ? ` (${durationText})` : '')}
                        editable={false}
                        pointerEvents="none"
                        style={[
                          styles.whiteInput,
                          routeDates
                            ? { color: Colors.light.titleColor }
                            : { color: Colors.light.hintText },
                        ]}
                        placeholder="여행 날짜를 선택해주세요."
                        placeholderTextColor={Colors.light.hintText}
                      />
                    </Pressable>

                    {showCalendar && (
                      <View style={styles.calendarContainer}>
                        <View style={styles.calendarHeader}>
                          <Pressable onPress={() => {}}>
                            <ThemedText style={styles.calendarArrow}>&lt;</ThemedText>
                          </Pressable>
                          <ThemedText style={styles.calendarMonthTitle}>7월</ThemedText>
                          <Pressable onPress={() => {}}>
                            <ThemedText style={styles.calendarArrow}>&gt;</ThemedText>
                          </Pressable>
                        </View>

                        <View style={styles.weekdaysRow}>
                          {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                            <ThemedText key={day} style={styles.weekdayText}>
                              {day}
                            </ThemedText>
                          ))}
                        </View>

                        <View style={styles.calendarGrid}>
                          {(() => {
                            const julyDays = Array.from({ length: 31 }, (_, _i) => _i + 1);
                            // July 1st, 2026 is Wednesday, so 2 empty slots (Mon, Tue)
                            const prefixEmptySlots = Array.from({ length: 2 }, () => null);
                            const calendarCells = [...prefixEmptySlots, ...julyDays];
                            return calendarCells.map((day, idx) => {
                              if (day === null) {
                                return (
                                  // biome-ignore lint/suspicious/noArrayIndexKey: Static prefix array
                                  <View key={`empty-${idx}`} style={styles.calendarCellEmpty} />
                                );
                              }

                              const isStart = startDate === day;
                              const isEnd = endDate === day;
                              const isInBetween =
                                typeof startDate === 'number' &&
                                typeof endDate === 'number' &&
                                day > startDate &&
                                day < endDate;

                              return (
                                <Pressable
                                  key={day}
                                  onPress={() => handleDayPress(day)}
                                  style={styles.calendarDayCell}
                                >
                                  {isInBetween && <View style={styles.calendarDayInBetweenBg} />}
                                  {isStart && endDate !== null && (
                                    <View style={styles.calendarDayStartBg} />
                                  )}
                                  {isEnd && startDate !== null && (
                                    <View style={styles.calendarDayEndBg} />
                                  )}
                                  <View
                                    style={[
                                      styles.calendarDayCircle,
                                      (isStart || isEnd) && styles.calendarDayCircleActive,
                                    ]}
                                  >
                                    <ThemedText
                                      style={[
                                        styles.calendarDayText,
                                        (isStart || isEnd) && styles.calendarDayTextActive,
                                        isInBetween && styles.calendarDayTextInBetween,
                                      ]}
                                    >
                                      {day}
                                    </ThemedText>
                                  </View>
                                </Pressable>
                              );
                            });
                          })()}
                        </View>
                      </View>
                    )}
                  </View>

                  {/* 여행 한 줄 설명 */}
                  <View style={styles.formItem}>
                    <View style={styles.labelRow}>
                      <ThemedText style={styles.formLabel}>여행 한 줄 설명</ThemedText>
                    </View>
                    <TextInput
                      value={routeDescription}
                      onChangeText={setRouteDescription}
                      style={[
                        styles.whiteInput,
                        routeDescription
                          ? { color: Colors.light.titleColor }
                          : { color: Colors.light.hintText },
                      ]}
                      placeholder="여행을 한 줄로 설명해주세요."
                      placeholderTextColor={Colors.light.hintText}
                    />
                  </View>

                  {/* 여행 카테고리 선택 */}
                  <View style={styles.formItem}>
                    <View style={styles.labelRow}>
                      <ThemedText style={styles.formLabel}>여행 카테고리 선택</ThemedText>
                      <ThemedText style={styles.requiredAsterisk}> *</ThemedText>
                    </View>

                    {/* Group 1: Themes */}
                    <View style={styles.categoryGrid}>
                      {THEME_CATEGORIES.map((cat) => {
                        const isSelected = selectedTheme === cat;
                        return (
                          <Pressable
                            key={cat}
                            onPress={() => setSelectedTheme(cat)}
                            style={[styles.categoryBadge, isSelected && styles.categoryBadgeActive]}
                          >
                            <ThemedText
                              style={[
                                styles.categoryBadgeText,
                                isSelected && styles.categoryBadgeTextActive,
                              ]}
                            >
                              {cat}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>

                    <View style={styles.categoryDivider} />

                    {/* Group 2: Companions */}
                    <View style={styles.categoryGrid}>
                      {COMPANION_CATEGORIES.map((cat) => {
                        const isSelected = selectedCompanion === cat;
                        return (
                          <Pressable
                            key={cat}
                            onPress={() => setSelectedCompanion(cat)}
                            style={[styles.categoryBadge, isSelected && styles.categoryBadgeActive]}
                          >
                            <ThemedText
                              style={[
                                styles.categoryBadgeText,
                                isSelected && styles.categoryBadgeTextActive,
                              ]}
                            >
                              {cat}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </View>

                <View style={styles.formFooter}>
                  <Pressable
                    onPress={() => isFormValid && setStep('day_planning')}
                    disabled={!isFormValid}
                    style={({ pressed }) => [
                      styles.submitBtn,
                      isFormValid ? styles.submitBtnActive : styles.submitBtnDisabled,
                      pressed && isFormValid && styles.pressed,
                    ]}
                  >
                    <ThemedText style={styles.submitBtnText}>장소 추가하기</ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backBtnTextRow, pressed && styles.pressed]}
                  >
                    <ThemedText style={styles.backBtnText}>취소</ThemedText>
                  </Pressable>
                </View>
              </View>
            )}

            {/* STEP 2: DAY-BY-DAY PLANNER (Matches User Screenshot) */}
            {step === 'day_planning' && (
              <View style={styles.formPageContainer}>
                <View style={styles.formHeader}>
                  <ThemedText style={styles.formTitle}>여행 생성하기</ThemedText>
                </View>

                <View style={styles.formBody}>
                  {/* Summary Card */}
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryBadges}>
                      <View style={styles.summaryBadgeTheme}>
                        <ThemedText style={styles.summaryBadgeThemeText}>
                          {selectedTheme}
                        </ThemedText>
                      </View>
                      <View style={styles.summaryBadgeCompanion}>
                        <ThemedText style={styles.summaryBadgeCompanionText}>
                          {selectedCompanion}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.summaryTitleRow}>
                      <View style={styles.avatarCircle}>
                        <ThemedText style={styles.avatarEmoji}>🐶</ThemedText>
                      </View>
                      <ThemedText style={styles.summaryTitleText}>{routeName}</ThemedText>
                    </View>

                    <View style={styles.summaryDateRow}>
                      <ThemedText style={styles.summaryDateText}>
                        {routeDates} ({durationText})
                      </ThemedText>
                    </View>
                  </View>

                  {/* Day Select Tabs */}
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
                              7/{dayNum}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* Daily Route Form */}
                  <View style={styles.dailyPlannerSection}>
                    {/* Start Point */}
                    <View style={styles.plannerItem}>
                      <ThemedText style={styles.plannerLabel}>출발지 *</ThemedText>
                      {currentPlan.start ? (
                        <View style={styles.placeValueBox}>
                          <Pressable
                            onPress={() => openSearch('start')}
                            style={{ flex: 1, justifyContent: 'center', alignSelf: 'stretch' }}
                          >
                            <ThemedText style={styles.placeValueText}>
                              {currentPlan.start.name}
                            </ThemedText>
                          </Pressable>
                          <Pressable
                            onPress={() => handleRemovePlace('start')}
                            style={styles.placeRemoveBtn}
                          >
                            <SymbolView name="xmark.circle.fill" tintColor="#8E8E93" size={18} />
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          onPress={() => openSearch('start')}
                          style={styles.placePlaceholderBox}
                        >
                          <ThemedText style={styles.placePlaceholderText}>
                            출발지를 추가해주세요.
                          </ThemedText>
                        </Pressable>
                      )}
                    </View>

                    {/* Waypoints */}
                    <View style={styles.plannerItem}>
                      <ThemedText style={styles.plannerLabel}>중간 경로</ThemedText>

                      {currentPlan.waypoints.map((wp, idx) => (
                        <View key={wp.id} style={styles.waypointBox}>
                          <Pressable
                            onPress={() => openSearch('waypoint', idx)}
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignSelf: 'stretch',
                            }}
                          >
                            <ThemedText style={styles.placeValueText}>{wp.name}</ThemedText>
                          </Pressable>

                          <View style={styles.waypointControlsRow}>
                            {idx > 0 && (
                              <Pressable
                                onPress={() => handleMoveWaypointUp(idx)}
                                style={styles.waypointControlBtn}
                              >
                                <SymbolView name="chevron.up" tintColor="#7A3B18" size={12} />
                              </Pressable>
                            )}
                            {idx < currentPlan.waypoints.length - 1 && (
                              <Pressable
                                onPress={() => handleMoveWaypointDown(idx)}
                                style={styles.waypointControlBtn}
                              >
                                <SymbolView name="chevron.down" tintColor="#7A3B18" size={12} />
                              </Pressable>
                            )}
                            <Pressable
                              onPress={() => handleRemoveWaypoint(idx)}
                              style={styles.waypointControlBtn}
                            >
                              <SymbolView name="xmark" tintColor="#8E8E93" size={12} />
                            </Pressable>
                            <View style={styles.waypointDragHandle}>
                              <SymbolView name="line.3.horizontal" tintColor="#C7C7CC" size={16} />
                            </View>
                          </View>
                        </View>
                      ))}

                      <Pressable onPress={() => openSearch('waypoint')} style={styles.plusCardBox}>
                        <SymbolView name="plus" tintColor="#7A3B18" size={16} />
                      </Pressable>
                    </View>

                    {/* Destination */}
                    <View style={styles.plannerItem}>
                      <ThemedText style={styles.plannerLabel}>도착지 *</ThemedText>
                      {currentPlan.end ? (
                        <View style={styles.placeValueBox}>
                          <Pressable
                            onPress={() => openSearch('end')}
                            style={{ flex: 1, justifyContent: 'center', alignSelf: 'stretch' }}
                          >
                            <ThemedText style={styles.placeValueText}>
                              {currentPlan.end.name}
                            </ThemedText>
                          </Pressable>
                          <Pressable
                            onPress={() => handleRemovePlace('end')}
                            style={styles.placeRemoveBtn}
                          >
                            <SymbolView name="xmark.circle.fill" tintColor="#8E8E93" size={18} />
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          onPress={() => openSearch('end')}
                          style={styles.placePlaceholderBox}
                        >
                          <ThemedText style={styles.placePlaceholderText}>
                            도착지를 추가해주세요.
                          </ThemedText>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.formFooter}>
                  <Pressable
                    onPress={handleSaveRoute}
                    disabled={!isSaveEnabled}
                    style={({ pressed }) => [
                      styles.submitBtn,
                      isSaveEnabled ? styles.submitBtnActive : styles.submitBtnDisabled,
                      pressed && isSaveEnabled && styles.pressed,
                    ]}
                  >
                    <ThemedText style={styles.submitBtnText}>여행 저장하기</ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={() => setStep('basic_info')}
                    style={({ pressed }) => [styles.backBtnTextRow, pressed && styles.pressed]}
                  >
                    <ThemedText style={styles.backBtnText}>이전 단계로</ThemedText>
                  </Pressable>
                </View>
              </View>
            )}
          </ThemedView>
        </ScrollView>
      )}

      {/* SEARCH VIEW */}
      {searchModalVisible && (
        <ThemedView
          style={[
            styles.modalContainer,
            { paddingTop: safeAreaInsets.top, backgroundColor: theme.backgroundElement },
          ]}
        >
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setSearchModalVisible(false)} style={styles.modalBackBtn}>
              <SymbolView name="chevron.left" tintColor="#7A3B18" size={22} />
            </Pressable>
            <View style={styles.modalSearchInputContainer}>
              <SymbolView
                name="magnifyingglass"
                tintColor="#7A3B18"
                size={18}
                style={{ marginRight: 8 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (selectedPlaceToConfirm?.name !== text) {
                    setSelectedPlaceToConfirm(null);
                  }
                }}
                placeholder="추가할 장소를 검색하세요."
                placeholderTextColor="#A9A9A9"
                style={[styles.modalSearchInputNew, { color: '#000000' }]}
                autoFocus
              />
            </View>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.suggestionListNew}>
            {filteredPlaces.map((item) => {
              const isSelected = selectedPlaceToConfirm?.id === item.id;
              const hasImage =
                item.name.includes('베이커리') ||
                item.name.includes('해수욕장') ||
                item.name.includes('공항');

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setSelectedPlaceToConfirm(item);
                    setSearchQuery(item.name);
                  }}
                  style={[styles.suggestionCard, isSelected && styles.suggestionCardActive]}
                >
                  <View style={styles.cardTopRow}>
                    <ThemedText style={styles.cardPlaceName}>{item.name}</ThemedText>
                    <View
                      style={[
                        styles.cardPlaceBadge,
                        item.category === '반려동물' && styles.cardPlaceBadgePet,
                        item.category === '배리어프리' && styles.cardPlaceBadgeBarrier,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.cardPlaceBadgeText,
                          item.category === '반려동물' && styles.cardPlaceBadgeTextPet,
                          item.category === '배리어프리' && styles.cardPlaceBadgeTextBarrier,
                        ]}
                      >
                        {item.category || '일반'}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.cardPlaceAddr}>{item.address}</ThemedText>

                  {hasImage && (
                    <Image
                      source={require('@/assets/images/abebe.png')}
                      style={styles.cardPlaceImage}
                      resizeMode="cover"
                    />
                  )}
                </Pressable>
              );
            })}

            {filteredPlaces.length === 0 && (
              <View style={styles.emptySearchContainer}>
                <ThemedText themeColor="textSecondary" style={styles.emptySearchText}>
                  검색 결과가 없습니다.
                </ThemedText>
                {searchQuery.trim().length > 0 && (
                  <Pressable onPress={handleAddCustomPlace} style={styles.customAddBtn}>
                    <ThemedText style={styles.customAddBtnText}>
                      + 직접 추가: "{searchQuery}"
                    </ThemedText>
                  </Pressable>
                )}
              </View>
            )}
          </ScrollView>

          {/* Bottom Button */}
          <View style={styles.modalBottomBtnContainer}>
            <Pressable
              onPress={() => {
                if (selectedPlaceToConfirm) {
                  handleSelectPlace(selectedPlaceToConfirm);
                }
              }}
              disabled={!selectedPlaceToConfirm}
              style={[
                styles.modalAddBtn,
                selectedPlaceToConfirm ? styles.modalAddBtnActive : styles.modalAddBtnDisabled,
              ]}
            >
              <ThemedText style={styles.modalAddBtnText}>장소 추가하기</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      )}
    </KeyboardAvoidingView>
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
  formPageContainer: {
    paddingBottom: Spacing.six,
    gap: Spacing.four,
    alignSelf: 'stretch',
  },
  formHeader: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    backgroundColor: 'transparent',
  },
  formTitle: {
    fontSize: 26,
    fontFamily: 'NEXON_Lv2_Gothic',
    fontWeight: 'bold',
    color: '#92390D',
  },
  formBody: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  formItem: {
    gap: Spacing.two,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  requiredAsterisk: {
    color: '#D36D3A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  whiteInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.light.hintText,
    fontFamily: 'NEXON_Lv2_Gothic',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    ...Platform.select({
      web: {
        // biome-ignore lint/suspicious/noExplicitAny: Outline style for web input
        outlineStyle: 'none' as any,
      },
      default: {},
    }),
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: Spacing.one,
    alignSelf: 'stretch',
  },
  categoryBadge: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '31%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryBadgeActive: {
    borderColor: '#D36D3A',
  },
  categoryBadgeText: {
    fontSize: 14,
    color: '#C7C7CC',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  categoryBadgeTextActive: {
    color: '#92390D',
    fontWeight: 'bold',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarArrow: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  calendarMonthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCellEmpty: {
    width: '14.28%',
    height: 40,
  },
  calendarDayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  calendarDayInBetweenBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#F5EBE6',
  },
  calendarDayStartBg: {
    position: 'absolute',
    left: '50%',
    right: 0,
    height: 32,
    backgroundColor: '#F5EBE6',
  },
  calendarDayEndBg: {
    position: 'absolute',
    left: 0,
    right: '50%',
    height: 32,
    backgroundColor: '#F5EBE6',
  },
  calendarDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  calendarDayCircleActive: {
    backgroundColor: '#92390D',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  calendarDayTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  calendarDayTextInBetween: {
    color: '#92390D',
    fontWeight: 'bold',
  },
  formFooter: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  submitBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.four,
  },
  submitBtnActive: {
    backgroundColor: '#D36D3A',
  },
  submitBtnDisabled: {
    backgroundColor: '#D1D1D6',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'NEXON_Lv2_Gothic',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },

  // Day-by-Day Planner specific styles (Mockup matching)
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    position: 'relative',
  },
  summaryBadges: {
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
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginVertical: 4,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5EBE6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#D36D3A',
  },
  avatarEmoji: {
    fontSize: 14,
  },
  summaryTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7A3B18',
    fontFamily: 'EF_jejudoldam',
  },
  summaryDateRow: {
    alignItems: 'flex-end',
  },
  summaryDateText: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  tabsContainer: {
    marginVertical: Spacing.one,
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
  dailyPlannerSection: {
    gap: Spacing.three,
  },
  plannerItem: {
    gap: 8,
  },
  plannerLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'NEXON_Lv2_Gothic',
    marginTop: 4,
  },
  placePlaceholderBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  placePlaceholderText: {
    fontSize: 14,
    color: '#D9D9D9',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  placeValueBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  placeValueText: {
    fontSize: 14,
    color: Colors.light.titleColor,
    fontWeight: '500',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  placeRemoveBtn: {
    padding: 4,
  },
  waypointBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  waypointControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waypointControlBtn: {
    padding: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5EBE6',
  },
  waypointDragHandle: {
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusCardBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  backBtnTextRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backBtnText: {
    color: '#8E8E93',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'NEXON_Lv2_Gothic',
  },

  // Modal styling
  modalContainer: {
    flex: 1,
    backgroundColor: '#F0F0F3',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 15,
    backgroundColor: '#F0F0F3',
    gap: 12,
  },
  modalBackBtn: {
    padding: 4,
  },
  modalSearchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  modalSearchInputNew: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'NEXON_Lv2_Gothic',
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
      default: {},
    }),
  },
  modalCloseBtn: {
    paddingHorizontal: 8,
  },
  modalCloseText: {
    fontSize: 15,
    color: '#D36D3A',
    fontWeight: '500',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  recHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginVertical: 12,
  },
  recHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  suggestionListNew: {
    paddingHorizontal: Spacing.four,
    paddingTop: 8,
    paddingBottom: 100,
  },
  suggestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1.5,
      },
      default: {},
    }),
  },
  suggestionCardActive: {
    borderColor: '#7A3B18', // Brown border for active select
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardPlaceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  cardPlaceBadge: {
    backgroundColor: '#FDEFE4', // general orange tag bg
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardPlaceBadgeText: {
    fontSize: 11,
    color: '#D36D3A',
    fontWeight: 'bold',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  cardPlaceBadgePet: {
    backgroundColor: '#D36D3A', // dark orange/terracotta for 반려동물
  },
  cardPlaceBadgeTextPet: {
    color: '#FFFFFF',
  },
  cardPlaceBadgeBarrier: {
    backgroundColor: '#007AFF', // blue for barrier free
  },
  cardPlaceBadgeTextBarrier: {
    color: '#FFFFFF',
  },
  cardPlaceAddr: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'NEXON_Lv2_Gothic',
    marginBottom: 8,
  },
  cardPlaceImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    marginTop: 8,
  },
  modalBottomBtnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F0F0F3',
    paddingHorizontal: Spacing.four,
    paddingVertical: 12,
  },
  modalAddBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAddBtnActive: {
    backgroundColor: '#7A3B18',
  },
  modalAddBtnDisabled: {
    backgroundColor: '#D9D9D9',
  },
  modalAddBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 16,
  },
  emptySearchText: {
    fontSize: 14,
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  customAddBtn: {
    backgroundColor: '#F5EBE6',
    borderWidth: 1,
    borderColor: '#D36D3A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  customAddBtnText: {
    color: '#92390D',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
});
