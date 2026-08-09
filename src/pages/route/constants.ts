import type { CourseType, TripCategory } from '@/api/dto/client';
import type { RoutePlace } from '@/stores/routeStore';

export type StepType = 'basic_info' | 'day_planning';

export const THEME_CATEGORIES = ['일반', '배리어프리', '반려동물'];
export const COMPANION_CATEGORIES = ['혼자', '가족과 함께', '친구와 함께', '애인과 함께', '그 외'];

export const THEME_TO_COURSE_TYPE: Record<string, CourseType> = {
  '일반': 'GENERAL',
  '배리어프리': 'BARRIER_FREE',
  '반려동물': 'PET',
};

export const COMPANION_TO_TRIP_CATEGORY: Record<string, TripCategory> = {
  '혼자': 'ALONE',
  '가족과 함께': 'FAMILY',
  '친구와 함께': 'FRIEND',
  '애인과 함께': 'LOVER',
  '그 외': 'ETC',
};

export const PREDEFINED_PLACES: RoutePlace[] = [
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
