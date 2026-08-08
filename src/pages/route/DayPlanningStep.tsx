import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import type { RoutePlace } from '@/stores/routeStore';
import type { DayPlan } from './constants';
import { styles } from './createRouteStyles';

interface DayPlanningStepProps {
  routeName: string;
  routeDates: string;
  durationText: string;
  selectedTheme: string;
  selectedCompanion: string;
  daysList: number[];
  selectedDayIdx: number;
  onSelectDay: (idx: number) => void;
  currentPlan: DayPlan;
  onOpenSearch: (type: 'start' | 'waypoint' | 'end', waypointIndex?: number) => void;
  onRemovePlace: (type: 'start' | 'end') => void;
  onRemoveWaypoint: (index: number) => void;
  onMoveWaypointUp: (index: number) => void;
  onMoveWaypointDown: (index: number) => void;
  isSaveEnabled: boolean;
  onSave: () => void;
  onBack: () => void;
}

export function DayPlanningStep({
  routeName,
  routeDates,
  durationText,
  selectedTheme,
  selectedCompanion,
  daysList,
  selectedDayIdx,
  onSelectDay,
  currentPlan,
  onOpenSearch,
  onRemovePlace,
  onRemoveWaypoint,
  onMoveWaypointUp,
  onMoveWaypointDown,
  isSaveEnabled,
  onSave,
  onBack,
}: DayPlanningStepProps) {
  return (
    <View style={styles.formPageContainer}>
      <View style={styles.formHeader}>
        <ThemedText style={styles.formTitle}>여행 생성하기</ThemedText>
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
            {/* Optional description text line */}
            <ThemedText style={{ fontSize: 13, color: '#333333', marginTop: 4 }}>
              좋사좋시
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
                  onPress={() => onSelectDay(idx)}
                  style={[styles.dayTab, isActive ? styles.dayTabActive : styles.dayTabInactive]}
                >
                  <ThemedText
                    style={[styles.dayTabText, isActive ? styles.dayTabTextActive : styles.dayTabTextInactive]}
                  >
                    8/{dayNum}
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
                  onPress={() => onOpenSearch('start')}
                  style={{ flex: 1, justifyContent: 'center', alignSelf: 'stretch' }}
                >
                  <ThemedText style={styles.placeValueText}>
                    {currentPlan.start.name}
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => onRemovePlace('start')}
                  style={styles.placeRemoveBtn}
                >
                  <SymbolView name="xmark.circle.fill" tintColor="#8E8E93" size={18} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => onOpenSearch('start')}
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
                  onPress={() => onOpenSearch('waypoint', idx)}
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
                      onPress={() => onMoveWaypointUp(idx)}
                      style={styles.waypointControlBtn}
                    >
                      <SymbolView name="chevron.up" tintColor="#E06635" size={12} />
                    </Pressable>
                  )}
                  {idx < currentPlan.waypoints.length - 1 && (
                    <Pressable
                      onPress={() => onMoveWaypointDown(idx)}
                      style={styles.waypointControlBtn}
                    >
                      <SymbolView name="chevron.down" tintColor="#E06635" size={12} />
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => onRemoveWaypoint(idx)}
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
              <Pressable onPress={() => onOpenSearch('waypoint')} style={styles.placePlaceholderBox}>
                <ThemedText style={styles.placePlaceholderText}>
                  중간 경로를 추가해주세요.
                </ThemedText>
              </Pressable>
            ) : (
              <Pressable onPress={() => onOpenSearch('waypoint')} style={styles.plusCardBox}>
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
                  onPress={() => onOpenSearch('end')}
                  style={{ flex: 1, justifyContent: 'center', alignSelf: 'stretch' }}
                >
                  <ThemedText style={styles.placeValueText}>
                    {currentPlan.end.name}
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => onRemovePlace('end')}
                  style={styles.placeRemoveBtn}
                >
                  <SymbolView name="xmark.circle.fill" tintColor="#8E8E93" size={18} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => onOpenSearch('end')}
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
