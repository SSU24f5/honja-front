import { createCourse } from '@/api/dto/client';
import { ThemedView } from '@/components/common/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useRouteStore } from '@/stores/routeStore';
import { BottomTabInset, Spacing } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BasicInfoStep } from './BasicInfoStep';
import {
  COMPANION_TO_TRIP_CATEGORY,
  THEME_TO_COURSE_TYPE,
} from './constants';
import { styles } from './createRouteStyles';

export default function CreateRouteScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const { createRoute } = useRouteStore();

  // API State
  const [isCreating, setIsCreating] = useState(false);

  // Basic Info States
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('일반');
  const [selectedCompanion, setSelectedCompanion] = useState('혼자');
  const [showCalendar, setShowCalendar] = useState(true);

  // Calendar month/year state
  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth()); // 0-indexed
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);

  const padDate = (n: number) => (n < 10 ? `0${n}` : n);

  // Build formatted date string for storage
  const routeDates = useMemo(() => {
    if (startDate === null) return '';
    const s = `${calendarYear}.${padDate(calendarMonth + 1)}.${padDate(startDate)}`;
    if (endDate === null) return s;
    const e = `${calendarYear}.${padDate(calendarMonth + 1)}.${padDate(endDate)}`;
    return `${s} ~ ${e}`;
  }, [startDate, endDate, calendarYear, calendarMonth]);

  const durationText = useMemo(() => {
    if (startDate === null) return '';
    if (endDate === null) return '당일치기';
    const nights = endDate - startDate;
    const days = nights + 1;
    return `${nights}박 ${days}일`;
  }, [startDate, endDate]);

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

  const handleDayPress = (day: number) => {
    if (startDate === null || endDate !== null) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (day < startDate) {
        setStartDate(day);
      } else if (day === startDate) {
        setEndDate(null);
      } else {
        setEndDate(day);
      }
    }
  };

  const handlePrevMonth = () => {
    setStartDate(null);
    setEndDate(null);
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    setStartDate(null);
    setEndDate(null);
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const isFormValid = routeName.trim() !== '' && startDate !== null && endDate !== null;

  // POST /course API → 생성 후 목록으로 돌아가기
  const handleCreateRoute = async () => {
    if (!isFormValid || isCreating) return;

    setIsCreating(true);
    try {
      const formatDate = (dayNum: number) =>
        `${calendarYear}-${padDate(calendarMonth + 1)}-${padDate(dayNum)}`;

      const result = await createCourse({
        name: routeName.trim(),
        description: routeDescription.trim(),
        isPublic: true,
        startDate: formatDate(startDate!),
        endDate: formatDate(endDate!),
        courseType: THEME_TO_COURSE_TYPE[selectedTheme] || 'GENERAL',
        tripCategory: COMPANION_TO_TRIP_CATEGORY[selectedCompanion] || 'ALONE',
      });

      if (result.isSuccess) {
        // Store에 경로 저장 (빈 itinerary로)
        createRoute(routeName, routeDates, durationText, selectedTheme, selectedCompanion);

        // 목록 화면으로 돌아가기
        router.navigate('/route' as any);
      } else {
        const msg = result.message || '경로 생성에 실패했습니다.';
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert('오류', msg);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('오류', msg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.backgroundElement }]}
        contentInset={insets}
        contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
      >
        <ThemedView style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
          <BasicInfoStep
            routeName={routeName}
            onRouteNameChange={setRouteName}
            routeDescription={routeDescription}
            onRouteDescriptionChange={setRouteDescription}
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
            selectedCompanion={selectedCompanion}
            onCompanionChange={setSelectedCompanion}
            routeDates={routeDates}
            durationText={durationText}
            showCalendar={showCalendar}
            onToggleCalendar={() => setShowCalendar(!showCalendar)}
            startDate={startDate}
            endDate={endDate}
            onDayPress={handleDayPress}
            isFormValid={isFormValid}
            isCreating={isCreating}
            onSubmit={handleCreateRoute}
            onCancel={() => router.back()}
            calendarMonth={calendarMonth}
            calendarYear={calendarYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
