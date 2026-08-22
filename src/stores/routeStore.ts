import { create } from 'zustand';
import type { ImageSourcePropType } from 'react-native';

export interface RoutePlace {
  id: string;
  name: string;
  category: string;
  address: string;
  
  // Optional properties for flexible UI routing support
  day?: number;
  type?: 'start' | 'waypoint' | 'end';
  coursePlaceId?: number;
  placeId?: number;
  contentId?: string;
  contentTypeId?: string;
  cat3?: string;
  image?: string;
  isPetPlace?: boolean;
  isBarrierFree?: boolean;
  mapx?: string;
  mapy?: string;
  placeType?: string;
  title?: string;
}

export interface SavedRoute {
  id: string;
  name: string;
  dates: string;
  duration: string;
  /** 동행유형 뱃지 예: '일반' / '배리어프리' / '애인과 함께' */
  tag?: string;
  tags?: string[];
  theme?: string;
  companion?: string;
  /** '셋이왓수다' 카드처럼 부제 문구가 있는 경우 */
  description?: string;
  /**
   * 참여자 아바타 이미지.
   * - 로컬 에셋: require('@/assets/avatars/xxx.png')
   * - 원격 이미지(임시 목업): { uri: 'https://...' }
   */
  avatars?: ImageSourcePropType[];
  itinerary: RoutePlace[];
}

interface RouteState {
  itinerary: RoutePlace[];
  recommendations: RoutePlace[];
  savedRoutes: SavedRoute[];
  addPlaceToRoute: (place: RoutePlace) => void;
  removePlaceFromRoute: (id: string) => void;
  movePlaceUp: (index: number) => void;
  movePlaceDown: (index: number) => void;
  clearItinerary: () => void;
  createRoute: (name: string, dates: string, duration: string, theme?: string, companion?: string) => void;
  deleteRoute: (id: string) => void;
  updateRouteItinerary: (id: string, newItinerary: RoutePlace[]) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  itinerary: [
    { id: 'route-p1', name: '제주국제공항', category: '교통', address: '제주 공항로 2' },
    { id: 'route-p2', name: '함덕 해수욕장', category: '관광지', address: '제주 조천읍 함덕리' },
    {
      id: 'route-p3',
      name: '에코랜드 테마파크',
      category: '관광지',
      address: '제주 번영로 1278-169',
    },
  ],
  recommendations: [
    {
      id: 'rec-1',
      name: '오설록 티 뮤지엄',
      category: '체험',
      address: '제주 안덕면 신화역사로 15',
    },
    { id: 'rec-2', name: '곽지 해수욕장', category: '관광지', address: '제주 애월읍 곽지리' },
    { id: 'rec-3', name: '우도 도항선 선착장', category: '교통', address: '제주 우도면' },
  ],
  savedRoutes: [
    {
      id: 'route-1',
      name: '혼자왓수다',
      dates: '26.07.10. ~ 26.07.14.',
      duration: '4박 5일',
      tag: '일반',
      itinerary: [
        { id: 'route-p1', name: '제주국제공항', category: '교통', address: '제주 공항로 2' },
        {
          id: 'route-p2',
          name: '함덕 해수욕장',
          category: '관광지',
          address: '제주 조천읍 함덕리',
        },
        {
          id: 'route-p3',
          name: '에코랜드 테마파크',
          category: '관광지',
          address: '제주 번영로 1278-169',
        },
      ],
    },
    {
      id: 'route-2',
      name: '셋이왓수다',
      dates: '26.07.10. ~ 26.07.14.',
      duration: '4박 5일',
      tag: '배리어프리',
      description: '제주도에 혼자왓수다 올해도 혼자 왓수다 내년에는 둘이 왓수다',
      // TODO: require('@/assets/avatars/xxx.png')로 교체
      avatars: [
        { uri: 'https://i.pravatar.cc/100?img=1' },
        { uri: 'https://i.pravatar.cc/100?img=2' },
      ],
      itinerary: [],
    },
    {
      id: 'route-3',
      name: '둘이왓수다',
      dates: '26.07.10. ~ 26.07.14.',
      duration: '4박 5일',
      tag: '애인과 함께',
      // TODO: require('@/assets/avatars/xxx.png')로 교체
      avatars: [{ uri: 'https://i.pravatar.cc/100?img=3' }],
      itinerary: [],
    },
  ],
  addPlaceToRoute: (place) =>
    set((state) => {
      if (state.itinerary.some((p) => p.id === place.id)) return {};
      return {
        itinerary: [...state.itinerary, place],
        recommendations: state.recommendations.filter((p) => p.id !== place.id),
      };
    }),
  removePlaceFromRoute: (id) =>
    set((state) => {
      const removed = state.itinerary.find((p) => p.id === id);
      return {
        itinerary: state.itinerary.filter((p) => p.id !== id),
        recommendations: removed ? [...state.recommendations, removed] : state.recommendations,
      };
    }),
  movePlaceUp: (index) =>
    set((state) => {
      if (index === 0) return {};
      const newItinerary = [...state.itinerary];
      const temp = newItinerary[index];
      newItinerary[index] = newItinerary[index - 1];
      newItinerary[index - 1] = temp;
      return { itinerary: newItinerary };
    }),
  movePlaceDown: (index) =>
    set((state) => {
      if (index === state.itinerary.length - 1) return {};
      const newItinerary = [...state.itinerary];
      const temp = newItinerary[index];
      newItinerary[index] = newItinerary[index + 1];
      newItinerary[index + 1] = temp;
      return { itinerary: newItinerary };
    }),
  clearItinerary: () =>
    set({
      itinerary: [],
    }),
  createRoute: (name, dates, duration, theme, companion) =>
    set((state) => {
      const newRoute: SavedRoute = {
        id: `route-${Date.now()}`,
        name,
        dates,
        duration,
        tag: theme || '일반',
        theme: theme || '일반',
        companion: companion || '혼자',
        itinerary: [...state.itinerary],
      };
      return {
        savedRoutes: [...state.savedRoutes, newRoute],
        itinerary: [],
      };
    }),
  deleteRoute: (id) =>
    set((state) => ({
      savedRoutes: state.savedRoutes.filter((r) => r.id !== id),
    })),
  updateRouteItinerary: (id, newItinerary) =>
    set((state) => ({
      savedRoutes: state.savedRoutes.map((r) =>
        r.id === id ? { ...r, itinerary: newItinerary } : r
      ),
    })),
}));