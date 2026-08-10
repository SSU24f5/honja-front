import type { RoutePlace } from '@/stores/routeStore';

export type StepType = 'basic_info' | 'day_planning';

export interface DayPlan {
  start: RoutePlace | null;
  waypoints: RoutePlace[];
  end: RoutePlace | null;
}

export interface SearchTarget {
  dayIndex: number;
  type: 'start' | 'waypoint' | 'end';
  waypointIndex?: number;
}
