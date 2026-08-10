import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { useDayPlanning } from '@/hooks/use-day-planning';
import { styles } from './createRouteStyles';

interface DayPlanningStepProps {
  title?: string;
  routeName: string;
  routeDates: string;
  selectedCompanion: string;
  daysList: number[];
  /** 탭에 표시할 월 숫자 (1-indexed) */
  month: number;
  onBack: () => void;
  onSave: () => void;
}

export function DayPlanningStep({
  title,
  routeName,
  routeDates,
  selectedCompanion,
  daysList,
  month,
  onBack,
  onSave,
}: DayPlanningStepProps) {
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
      <View style={styles.formHeader}>
        <ThemedText style={styles.formTitle}>{title ?? '여행 생성하기'}</ThemedText>
      </View>

      <View style={styles.formBody}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText style={styles.summaryTitleText}>{routeName || '혼자왔어유'}</ThemedText>
            <Pressable style={styles.inviteBtn}>
              <ThemedText style={styles.inviteBtnText}>초대하기</ThemedText>
            </Pressable>
          </View>

          <View style={{ gap: 6, marginTop: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}>
              <View style={styles.summaryBadgeDate}>
                <ThemedText style={styles.summaryBadgeDateText}>{routeDates}</ThemedText>
              </View>
              <View style={styles.summaryBadgeCompanion}>
                <ThemedText style={styles.summaryBadgeCompanionText}>{selectedCompanion}</ThemedText>
              </View>
            </View>
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
                  style={[styles.dayTab, isActive ? styles.dayTabActive : styles.dayTabInactive]}
                >
                  <ThemedText
                    style={[styles.dayTabText, isActive ? styles.dayTabTextActive : styles.dayTabTextInactive]}
                  >
                    {month}/{dayNum}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText style={styles.plannerLabel}>출발지</ThemedText>
              <ThemedText style={styles.requiredAsterisk}> *</ThemedText>
            </View>
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
                  onPress={() => removePlace('start')}
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
                      onPress={() => moveWaypointUp(idx)}
                      style={styles.waypointControlBtn}
                    >
                      <SymbolView name="chevron.up" tintColor="#E06635" size={12} />
                    </Pressable>
                  )}
                  {idx < currentPlan.waypoints.length - 1 && (
                    <Pressable
                      onPress={() => moveWaypointDown(idx)}
                      style={styles.waypointControlBtn}
                    >
                      <SymbolView name="chevron.down" tintColor="#E06635" size={12} />
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => removeWaypoint(idx)}
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

            {currentPlan.waypoints.length === 0 ? (
              <Pressable onPress={() => openSearch('waypoint')} style={styles.placePlaceholderBox}>
                <ThemedText style={styles.placePlaceholderText}>
                  중간 경로를 추가해주세요.
                </ThemedText>
              </Pressable>
            ) : (
              <Pressable onPress={() => openSearch('waypoint')} style={styles.plusCardBox}>
                <SymbolView name="plus" tintColor="#E06635" size={16} />
              </Pressable>
            )}
          </View>

          {/* Destination */}
          <View style={styles.plannerItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText style={styles.plannerLabel}>도착지</ThemedText>
              <ThemedText style={styles.requiredAsterisk}> *</ThemedText>
            </View>
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
                  onPress={() => removePlace('end')}
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
          onPress={onSave}
          disabled={!isSaveEnabled}
          style={({ pressed }) => [
            styles.submitBtn,
            isSaveEnabled ? styles.submitBtnActive : styles.submitBtnDisabled,
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
