import { useMemo } from 'react';
import type { DayPlan } from '@/pages/route/constants';
import { useDayPlanningStore } from '@/stores/dayPlanningStore';

/**
 * DayPlanningStep에 필요한 상태와 액션을 제공하는 커스텀 훅.
 * Zustand 스토어를 래핑하여 컴포넌트가 직접 스토어를 알 필요 없게 한다.
 */
export function useDayPlanning() {
  const selectedDayIdx = useDayPlanningStore((s) => s.selectedDayIdx);
  const dayPlans = useDayPlanningStore((s) => s.dayPlans);
  const searchModalVisible = useDayPlanningStore((s) => s.searchModalVisible);
  const searchTarget = useDayPlanningStore((s) => s.searchTarget);

  const setSelectedDayIdx = useDayPlanningStore((s) => s.setSelectedDayIdx);
  const openSearch = useDayPlanningStore((s) => s.openSearch);
  const closeSearch = useDayPlanningStore((s) => s.closeSearch);
  const selectPlace = useDayPlanningStore((s) => s.selectPlace);
  const removePlace = useDayPlanningStore((s) => s.removePlace);
  const removeWaypoint = useDayPlanningStore((s) => s.removeWaypoint);
  const moveWaypointUp = useDayPlanningStore((s) => s.moveWaypointUp);
  const moveWaypointDown = useDayPlanningStore((s) => s.moveWaypointDown);
  const reorderWaypoints = useDayPlanningStore((s) => s.reorderWaypoints);
  const resetDayPlans = useDayPlanningStore((s) => s.resetDayPlans);
  const setSelectedRouteId = useDayPlanningStore((s) => s.setSelectedRouteId);

  const currentPlan: DayPlan = useMemo(
    () => dayPlans[selectedDayIdx] ?? { start: null, waypoints: [], end: null },
    [dayPlans, selectedDayIdx],
  );

  const isSaveEnabled = currentPlan.start !== null && currentPlan.end !== null;

  return {
    selectedDayIdx,
    dayPlans,
    searchModalVisible,
    searchTarget,
    currentPlan,
    isSaveEnabled,

    setSelectedDayIdx,
    setSelectedRouteId,
    openSearch,
    closeSearch,
    selectPlace,
    removePlace,
    removeWaypoint,
    moveWaypointUp,
    moveWaypointDown,
    reorderWaypoints,
    resetDayPlans,
  };
}
