import type { ImageSourcePropType } from 'react-native';
import { create } from 'zustand';

export interface RoutePlace {
  id: string;
  name: string;
  title?: string;
  category: string;
  address: string;
  image?: string;
  day?: number;
  type?: 'start' | 'waypoint' | 'end';
  coursePlaceId?: number;
  placeId?: number;
  contentId?: string;
  contentTypeId?: string;
  cat3?: string;
  isPetPlace?: boolean;
  isBarrierFree?: boolean;
  mapx?: string;
  mapy?: string;
  placeType?: string;
}

export interface SavedRoute {
  id: string;
  name: string;
  dates: string;
  duration: string;
  /** 예: ['일반', '혼자'] / ['일반', '친구와 함께'] / ['일반', '가족과 함께'] */
  tags: string[];
  /** '셋이왓수다' 카드처럼 부제 문구가 있는 경우 */
  description?: string;
  /**
   * 참여자 아바타 이미지.
   * - 로컬 에셋: require('@/assets/avatars/xxx.png')
   * - 원격 이미지(임시 목업): { uri: 'https://...' }
   */
  avatars?: ImageSourcePropType[];
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
  deleteRoute: (id: string) => void;
  updateRouteItinerary: (id: string, itinerary: RoutePlace[]) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  itinerary: [],
  recommendations: [],
  savedRoutes: [],
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
        tags: ['일반'],
        itinerary: [...state.itinerary],
        theme,
        companion,
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
  updateRouteItinerary: (id, itinerary) =>
    set((state) => ({
      savedRoutes: state.savedRoutes.map((r) => (r.id === id ? { ...r, itinerary } : r)),
    })),
}));
