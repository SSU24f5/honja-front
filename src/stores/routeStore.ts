import { create } from 'zustand';

export interface RoutePlace {
  id: string;
  name: string;
  category: string;
  address: string;
  day?: number;
  type?: 'start' | 'waypoint' | 'end';
}

export interface SavedRoute {
  id: string;
  name: string;
  dates: string;
  duration: string;
  itinerary: RoutePlace[];
  theme?: string;
  companion?: string;
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
  setItinerary: (itinerary: RoutePlace[]) => void;
  createRoute: (
    name: string,
    dates: string,
    duration: string,
    theme?: string,
    companion?: string,
  ) => void;
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
      theme: '일반',
      companion: '혼자',
      itinerary: [
        {
          id: 'route-p-start',
          name: '어쩌구 호텔',
          category: '숙소',
          address: '제주특별자치도 제주시 어쩌구동 123',
          day: 0,
          type: 'start',
        },
        {
          id: 'route-p-wp1',
          name: '김녕 해수욕장',
          category: '관광지',
          address: '제주특별자치도 제주시 구좌읍 김녕리',
          day: 0,
          type: 'waypoint',
        },
        {
          id: 'route-p-wp2',
          name: '아베베 베이커리',
          category: '음식점',
          address: '제주특별자치도 제주시 동문로6길 4',
          day: 0,
          type: 'waypoint',
        },
        {
          id: 'route-p-wp3',
          name: '으브브 베이커리',
          category: '음식점',
          address: '제주특별자치도 제주시 동문로6길 5',
          day: 0,
          type: 'waypoint',
        },
        {
          id: 'route-p-end',
          name: '맛있는 고기국수',
          category: '음식점',
          address: '제주특별자치도 제주시 국수길 1',
          day: 0,
          type: 'end',
        },
      ],
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
  setItinerary: (itinerary) =>
    set({
      itinerary,
    }),
  createRoute: (name, dates, duration, theme, companion) =>
    set((state) => {
      const newRoute: SavedRoute = {
        id: `route-${Date.now()}`,
        name,
        dates,
        duration,
        itinerary: [...state.itinerary],
        theme,
        companion,
      };
      return {
        savedRoutes: [...state.savedRoutes, newRoute],
        itinerary: [],
      };
    }),
}));
