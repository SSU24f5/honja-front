import { useMemo } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import LeftBackIcon from '@/assets/icon/basic/left_back.svg';
import { ThemedText } from '@/components/common/themed-text';
import { THEME_CATEGORIES } from './constants';
import { styles } from './createRouteStyles';

const DAY_OF_WEEK_KR = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** 캘린더 그리드는 월요일 시작 → 월·화·수·목·금·토·일 순서 */
const CALENDAR_WEEKDAYS = [...DAY_OF_WEEK_KR.slice(1), DAY_OF_WEEK_KR[0]] as const;

interface BasicInfoStepProps {
  routeName: string;
  onRouteNameChange: (text: string) => void;
  routeDescription: string;
  onRouteDescriptionChange: (text: string) => void;
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  selectedCompanion: string;
  onCompanionChange: (companion: string) => void;
  routeDates: string;
  durationText: string;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  startDate: number | null;
  endDate: number | null;
  onDayPress: (day: number) => void;
  isFormValid: boolean;
  isCreating: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  /** Current calendar month (0-indexed, e.g. 7 = August) */
  calendarMonth: number;
  /** Current calendar year */
  calendarYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function formatDateLabel(year: number, month: number, day: number): string {
  const d = new Date(year, month, day);
  const dow = DAY_OF_WEEK_KR[d.getDay()];
  return `${month + 1}월 ${day}일 (${dow})`;
}

export function BasicInfoStep({
  routeName,
  onRouteNameChange,
  routeDescription,
  onRouteDescriptionChange,
  selectedTheme,
  onThemeChange,
  showCalendar,
  onToggleCalendar,
  startDate,
  endDate,
  onDayPress,
  isFormValid,
  isCreating,
  onSubmit,
  onCancel,
  calendarMonth,
  calendarYear,
  onPrevMonth,
  onNextMonth,
}: BasicInfoStepProps) {
  // Build the formatted date display string
  const dateDisplayText = useMemo(() => {
    if (startDate === null) return '';
    const startLabel = formatDateLabel(calendarYear, calendarMonth, startDate);
    if (endDate === null) return startLabel;
    const endLabel = formatDateLabel(calendarYear, calendarMonth, endDate);
    return `${startLabel} ~ ${endLabel}`;
  }, [startDate, endDate, calendarYear, calendarMonth]);

  // Calendar grid computation
  const calendarCells = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    // Convert Sunday(0) to 6, Monday(1) to 0, ...
    const prefixSlots = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const empties: null[] = Array.from({ length: prefixSlots }, () => null);
    const days: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...empties, ...days];
  }, [calendarYear, calendarMonth]);

  const monthLabel = `${calendarMonth + 1}월`;

  return (
    <View style={styles.formPageContainer}>
      {/* Back Arrow — SVG 아이콘 사용 */}
      <View style={styles.formHeaderRow}>
        <Pressable onPress={onCancel} hitSlop={12}>
          <LeftBackIcon width={11} height={17} />
        </Pressable>
      </View>

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
            onChangeText={onRouteNameChange}
            style={styles.whiteInput}
            placeholder="여행 이름을 입력해주세요."
            placeholderTextColor="#C0C0C0"
          />
        </View>

        {/* 여행 날짜 */}
        <View style={styles.formItem}>
          <View style={styles.labelRow}>
            <ThemedText style={styles.formLabel}>여행 날짜</ThemedText>
            <ThemedText style={styles.requiredAsterisk}> *</ThemedText>
          </View>
          <Pressable onPress={onToggleCalendar}>
            <TextInput
              value={dateDisplayText}
              editable={false}
              pointerEvents="none"
              style={styles.whiteInput}
              placeholder="여행 날짜를 선택해주세요."
              placeholderTextColor="#C0C0C0"
            />
          </Pressable>

          {showCalendar && (
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Pressable onPress={onPrevMonth} hitSlop={12}>
                  <ThemedText style={styles.calendarArrow}>{'‹'}</ThemedText>
                </Pressable>
                <ThemedText style={styles.calendarMonthTitle}>{monthLabel}</ThemedText>
                <Pressable onPress={onNextMonth} hitSlop={12}>
                  <ThemedText style={styles.calendarArrow}>{'›'}</ThemedText>
                </Pressable>
              </View>

              <View style={styles.weekdaysRow}>
                {CALENDAR_WEEKDAYS.map((day) => (
                  <ThemedText key={day} style={styles.weekdayText}>
                    {day}
                  </ThemedText>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {calendarCells.map((day, idx) => {
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
                      onPress={() => onDayPress(day)}
                      style={styles.calendarDayCell}
                    >
                      <View
                        style={[
                          styles.calendarDayBlock,
                          (isStart || isEnd) && styles.calendarDayBlockActive,
                          isInBetween && styles.calendarDayBlockInBetween,
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
                })}
              </View>
            </View>
          )}
        </View>

        {/* 여행 카테고리 */}
        <View style={styles.formItem}>
          <View style={styles.labelRow}>
            <ThemedText style={styles.formLabel}>여행 카테고리</ThemedText>
            <ThemedText style={styles.requiredAsterisk}> *</ThemedText>
          </View>

          <View style={styles.categoryGrid}>
            {THEME_CATEGORIES.map((cat) => {
              const isSelected = selectedTheme === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => onThemeChange(cat)}
                  style={[styles.categoryBadge, isSelected && styles.categoryBadgeActive]}
                >
                  <ThemedText
                    type="small"
                    numberOfLines={1}
                    style={[styles.categoryBadgeText, isSelected && styles.categoryBadgeTextActive]}
                  >
                    {cat}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 여행 소개 */}
        <View style={styles.formItem}>
          <ThemedText style={styles.formLabel}>여행 소개</ThemedText>
          <TextInput
            value={routeDescription}
            onChangeText={onRouteDescriptionChange}
            style={[styles.whiteInput, styles.multilineInput]}
            placeholder="여행 소개를 입력해주세요."
            placeholderTextColor="#C0C0C0"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.formFooter}>
        <Pressable
          onPress={onSubmit}
          disabled={!isFormValid || isCreating}
          style={({ pressed }) => [
            styles.submitBtn,
            isFormValid && !isCreating ? styles.submitBtnActive : styles.submitBtnDisabled,
            pressed && isFormValid && !isCreating && styles.pressed,
          ]}
        >
          {isCreating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <ThemedText style={styles.submitBtnText}>생성하기</ThemedText>
          )}
        </Pressable>
      </View>
    </View>
  );
}
