import { create } from 'zustand';
import type { RoutePlace } from './routeStore';
import type { DayPlan, SearchTarget } from '@/pages/route/constants';

interface DayPlanningState {
  /** 선택된 여행 ID */
  selectedRouteId: string | null;
  /** 선택된 날짜 탭 인덱스 */
  selectedDayIdx: number;
  /** 일별 플랜 맵 */
  dayPlans: Record<number, DayPlan>;
  /** 장소 검색 모달 표시 여부 */
  searchModalVisible: boolean;
  /** 현재 검색 타깃 */
  searchTarget: SearchTarget | null;

  setSelectedRouteId: (id: string | null) => void;
  setSelectedDayIdx: (idx: number) => void;
  openSearch: (type: 'start' | 'waypoint' | 'end', waypointIndex?: number) => void;
  closeSearch: () => void;
  selectPlace: (place: RoutePlace) => void;
  removePlace: (type: 'start' | 'end') => void;
  removeWaypoint: (index: number) => void;
  moveWaypointUp: (index: number) => void;
  moveWaypointDown: (index: number) => void;
  resetDayPlans: () => void;
}

export const useDayPlanningStore = create<DayPlanningState>((set, get) => ({
  selectedRouteId: null,
  selectedDayIdx: 0,
  dayPlans: {},
  searchModalVisible: false,
  searchTarget: null,

  setSelectedRouteId: (id) =>
    set({ selectedRouteId: id, selectedDayIdx: 0, dayPlans: {} }),

  setSelectedDayIdx: (idx) => set({ selectedDayIdx: idx }),

  openSearch: (type, waypointIndex) =>
    set((state) => ({
      searchTarget: { dayIndex: state.selectedDayIdx, type, waypointIndex },
      searchModalVisible: true,
    })),

  closeSearch: () => set({ searchModalVisible: false, searchTarget: null }),

  selectPlace: (place) => {
    const { searchTarget, dayPlans } = get();
    if (!searchTarget) return;

    const { dayIndex, type, waypointIndex } = searchTarget;
    const existing: DayPlan = dayPlans[dayIndex] ?? { start: null, waypoints: [], end: null };

    let updated: DayPlan;
    if (type === 'start') {
      updated = { ...existing, start: place };
    } else if (type === 'end') {
      updated = { ...existing, end: place };
    } else {
      if (typeof waypointIndex === 'number') {
        const updatedWaypoints = [...existing.waypoints];
        updatedWaypoints[waypointIndex] = place;
        updated = { ...existing, waypoints: updatedWaypoints };
      } else {
        if (existing.waypoints.some((wp) => wp.id === place.id)) return;
        updated = { ...existing, waypoints: [...existing.waypoints, place] };
      }
    }

    set((state) => ({
      dayPlans: { ...state.dayPlans, [dayIndex]: updated },
      searchModalVisible: false,
      searchTarget: null,
    }));
  },

  removePlace: (type) =>
    set((state) => {
      const { selectedDayIdx, dayPlans } = state;
      const existing: DayPlan = dayPlans[selectedDayIdx] ?? {
        start: null,
        waypoints: [],
        end: null,
      };
      const updated =
        type === 'start'
          ? { ...existing, start: null }
          : { ...existing, end: null };
      return { dayPlans: { ...dayPlans, [selectedDayIdx]: updated } };
    }),

  removeWaypoint: (index) =>
    set((state) => {
      const { selectedDayIdx, dayPlans } = state;
      const existing: DayPlan = dayPlans[selectedDayIdx] ?? {
        start: null,
        waypoints: [],
        end: null,
      };
      const updatedWaypoints = [...existing.waypoints];
      updatedWaypoints.splice(index, 1);
      return {
        dayPlans: {
          ...dayPlans,
          [selectedDayIdx]: { ...existing, waypoints: updatedWaypoints },
        },
      };
    }),

  moveWaypointUp: (index) =>
    set((state) => {
      if (index === 0) return {};
      const { selectedDayIdx, dayPlans } = state;
      const existing: DayPlan = dayPlans[selectedDayIdx] ?? {
        start: null,
        waypoints: [],
        end: null,
      };
      const waypoints = [...existing.waypoints];
      [waypoints[index - 1], waypoints[index]] = [waypoints[index], waypoints[index - 1]];
      return {
        dayPlans: { ...dayPlans, [selectedDayIdx]: { ...existing, waypoints } },
      };
    }),

  moveWaypointDown: (index) =>
    set((state) => {
      const { selectedDayIdx, dayPlans } = state;
      const existing: DayPlan = dayPlans[selectedDayIdx] ?? {
        start: null,
        waypoints: [],
        end: null,
      };
      if (index >= existing.waypoints.length - 1) return {};
      const waypoints = [...existing.waypoints];
      [waypoints[index], waypoints[index + 1]] = [waypoints[index + 1], waypoints[index]];
      return {
        dayPlans: { ...dayPlans, [selectedDayIdx]: { ...existing, waypoints } },
      };
    }),

  resetDayPlans: () => set({ selectedDayIdx: 0, dayPlans: {} }),
}));
