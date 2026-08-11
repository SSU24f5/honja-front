import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, View } from 'react-native';
import LeftBackIcon from '@/assets/icon/basic/left_back.svg';
import RightArrowIcon from '@/assets/icon/basic/right_arrow.svg';
import { ThemedText } from '@/components/common/themed-text';
import { useDayPlanning } from '@/hooks/use-day-planning';
import { useTheme } from '@/hooks/use-theme';
import { styles } from './createRouteStyles';

interface DayPlanningStepProps {
  title?: string;
  routeName: string;
  routeDates: string;
  selectedTheme?: string;
  routeDescription?: string;
  daysList: number[];
  /** 탭에 표시할 월 숫자 (1-indexed) */
  month: number;
  onBack: () => void;
  onSave: () => void;
  onOpenWaypoints?: () => void;
  onOpenMoreOptions?: () => void;
}

export function DayPlanningStep({
  title,
  routeName,
  routeDates,
  selectedTheme = '일반',
  routeDescription,
  daysList,
  month,
  onBack,
  onSave,
  onOpenWaypoints,
  onOpenMoreOptions,
}: DayPlanningStepProps) {
  const theme = useTheme();
  const {
    selectedDayIdx,
    currentPlan,
    isSaveEnabled,
    setSelectedDayIdx,
    openSearch,
    removePlace,
    removeWaypoint,
    moveWaypointUp,
    moveWaypointDown,
  } = useDayPlanning();

  return (
    <View style={styles.formPageContainer}>
      {/* 뒤로가기 버튼 */}
      <View style={styles.formHeaderRow}>
        <Pressable onPress={onBack} hitSlop={10} style={{ paddingVertical: 4 }}>
          <LeftBackIcon width={12} height={18} />
        </Pressable>
      </View>

      <View style={styles.formBody}>
        {/* 상단 코스 타이틀 (카드의 외부에 대형 볼드로 위치) */}
        <ThemedText style={styles.screenHeaderTitle}>
          {routeName || '혼자왔어유'}
        </ThemedText>

        {/* 상단 경로 정보 카드 */}
        <View style={styles.summaryCardNew}>
          {/* 카드 우측 상단: 날짜 뱃지 + 일반/테마 뱃지 + 더보기(•••) */}
          <View style={styles.summaryCardTopRow}>
            <View style={styles.summaryBadgesContainer}>
              <View style={styles.summaryBadgeDateNew}>
                <ThemedText style={styles.summaryBadgeDateTextNew}>
                  {routeDates || '26/08/08 ~ 26/08/11'}
                </ThemedText>
              </View>
              <View style={styles.summaryBadgeThemeNew}>
                <ThemedText style={styles.summaryBadgeThemeTextNew}>
                  {selectedTheme}
                </ThemedText>
              </View>
            </View>

            <Pressable onPress={onOpenMoreOptions} hitSlop={10} style={styles.moreOptionsBtn}>
              <ThemedText style={styles.moreOptionsText}>•••</ThemedText>
            </Pressable>
          </View>

          {/* 카드 본문: 설명 텍스트 (예: 좋사좋시) */}
          <View style={styles.summaryCardContent}>
            <ThemedText style={styles.summaryDescriptionText}>
              {routeDescription || '좋사좋시'}
            </ThemedText>
          </View>

          {/* 은은한 카드 하단 구분선 */}
          <View style={styles.summaryCardDivider} />
        </View>

        {/* 날짜 탭 (일별 탭 피필) */}
        <View style={styles.tabsContainerNew}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContentNew}
          >
            {daysList.map((dayNum, idx) => {
              const isActive = selectedDayIdx === idx;
              return (
                <Pressable
                  key={dayNum}
                  onPress={() => setSelectedDayIdx(idx)}
                  style={[
                    styles.dayTabNew,
                    isActive ? styles.dayTabActiveNew : styles.dayTabInactiveNew,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.dayTabTextNew,
                      isActive ? styles.dayTabTextActiveNew : styles.dayTabTextInactiveNew,
                    ]}
                  >
                    {month}/{dayNum}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 일별 계획 입력 폼 */}
        <View style={styles.dailyPlannerSectionNew}>
          {/* 출발지 */}
          <View style={styles.plannerItemNew}>
            <View style={styles.plannerLabelRow}>
              <ThemedText style={styles.plannerLabelNew}>출발지</ThemedText>
              <ThemedText style={styles.requiredAsteriskNew}> *</ThemedText>
            </View>

            {currentPlan.start ? (
                <View style={styles.placeValueBoxNew}>
                  <Pressable
                    onPress={() => openSearch('start')}
                    style={{ flex: 1, justifyContent: 'center', alignSelf: 'stretch' }}
                  >
                    <ThemedText style={styles.placeValueTextNew}>
                      {currentPlan.start.name}
                    </ThemedText>
                  </Pressable>
                  <Pressable onPress={() => removePlace('start')} style={styles.placeRemoveBtn}>
                    <SymbolView name="xmark.circle.fill" tintColor="#8E8E93" size={18} />
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={() => openSearch('start')} style={styles.placePlaceholderBoxNew}>
                  <ThemedText style={styles.placePlaceholderTextNew}>
                    출발지를 추가해주세요.
                  </ThemedText>
                </Pressable>
              )}
          </View>

          {/* 중간 경로 */}
          <View style={styles.plannerItemNew}>
            <Pressable
              onPress={onOpenWaypoints}
              style={({ pressed }) => [
                styles.plannerLabelRow,
                { gap: 4 },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.plannerLabelNew}>중간 경로</ThemedText>
              <RightArrowIcon width={7} height={13} fill="#292929" style={{ marginLeft: 2 }} />
            </Pressable>

            {currentPlan.waypoints.map((wp, idx) => (
              <View key={wp.id} style={styles.waypointBoxNew}>
                <Pressable
                  onPress={() => openSearch('waypoint', idx)}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignSelf: 'stretch',
                  }}
                >
                  <ThemedText style={styles.placeValueTextNew}>{wp.name}</ThemedText>
                </Pressable>
                <Pressable onPress={() => removeWaypoint(idx)} style={styles.placeRemoveBtn}>
                  <SymbolView name="xmark.circle.fill" tintColor="#8E8E93" size={18} />
                </Pressable>
              </View>
            ))}

            {currentPlan.waypoints.length === 0 ? (
              <Pressable
                onPress={onOpenWaypoints || (() => openSearch('waypoint'))}
                style={styles.placePlaceholderBoxNew}
              >
                <ThemedText style={styles.placePlaceholderTextNew}>
                  중간 경로를 추가해주세요.
                </ThemedText>
              </Pressable>
            ) : (
              <Pressable onPress={() => openSearch('waypoint')} style={styles.plusCardBoxNew}>
                <SymbolView name="plus" tintColor="#E06635" size={16} />
              </Pressable>
            )}
          </View>

          {/* 도착지 */}
          <View style={styles.plannerItemNew}>
            <View style={styles.plannerLabelRow}>
              <ThemedText style={styles.plannerLabelNew}>도착지</ThemedText>
              <ThemedText style={styles.requiredAsteriskNew}> *</ThemedText>
            </View>
            {currentPlan.end ? (
              <View style={styles.placeValueBoxNew}>
                <Pressable
                  onPress={() => openSearch('end')}
                  style={{ flex: 1, justifyContent: 'center', alignSelf: 'stretch' }}
                >
                  <ThemedText style={styles.placeValueTextNew}>{currentPlan.end.name}</ThemedText>
                </Pressable>
                <Pressable onPress={() => removePlace('end')} style={styles.placeRemoveBtn}>
                  <SymbolView name="xmark.circle.fill" tintColor="#8E8E93" size={18} />
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => openSearch('end')} style={styles.placePlaceholderBoxNew}>
                <ThemedText style={styles.placePlaceholderTextNew}>
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
          onPress={onSave}
          disabled={!isSaveEnabled}
          style={({ pressed }) => [
            styles.submitBtn,
            isSaveEnabled
              ? [styles.submitBtnActive, { backgroundColor: theme.brandPrimary }]
              : styles.submitBtnDisabled,
            pressed && isSaveEnabled && styles.pressed,
          ]}
        >
          <ThemedText style={styles.submitBtnText}>저장하기</ThemedText>
        </Pressable>

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.backBtnTextRow, pressed && styles.pressed]}
        >
          <ThemedText style={styles.backBtnText}>이전 단계로</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}
