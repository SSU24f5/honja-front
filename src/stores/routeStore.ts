import { create } from 'zustand';

export interface RoutePlace {
  id: string;
  name: string;
  category: string;
  address: string;
}

interface RouteState {
  itinerary: RoutePlace[];
  recommendations: RoutePlace[];
  addPlaceToRoute: (place: RoutePlace) => void;
  removePlaceFromRoute: (id: string) => void;
  movePlaceUp: (index: number) => void;
  movePlaceDown: (index: number) => void;
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
}));
