import { create } from 'zustand';

export interface MapPlace {
  id: string;
  name: string;
  category: string;
  description: string;
  barrierFree: boolean;
  petFriendly: boolean;
  parking: boolean;
  latitude: number;
  longitude: number;
  favorite: boolean;
}

interface MapState {
  filters: {
    barrierFree: boolean;
    petFriendly: boolean;
    parking: boolean;
  };
  places: MapPlace[];
  toggleFilter: (filterKey: 'barrierFree' | 'petFriendly' | 'parking') => void;
  toggleFavorite: (id: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  filters: {
    barrierFree: false,
    petFriendly: false,
    parking: false,
  },
  places: [
    {
      id: 'place-1',
      name: '협재 해수욕장',
      category: '해변',
      description: '에메랄드빛 바다와 부드러운 백사장',
      barrierFree: true,
      petFriendly: true,
      parking: true,
      latitude: 33.394,
      longitude: 126.239,
      favorite: true,
    },
    {
      id: 'place-2',
      name: '성산일출봉',
      category: '자연명소',
      description: '푸른 바다 위 우뚝 솟은 화산산맥',
      barrierFree: false,
      petFriendly: false,
      parking: true,
      latitude: 33.458,
      longitude: 126.942,
      favorite: true,
    },
    {
      id: 'place-3',
      name: '비자림',
      category: '숲길',
      description: '수령 500~800년 된 비자나무 군락지',
      barrierFree: true,
      petFriendly: false,
      parking: true,
      latitude: 33.491,
      longitude: 126.811,
      favorite: false,
    },
    {
      id: 'place-4',
      name: '카멜리아 힐',
      category: '수목원',
      description: '사계절 아름다운 동백 꽃 정원',
      barrierFree: true,
      petFriendly: true,
      parking: true,
      latitude: 33.29,
      longitude: 126.37,
      favorite: false,
    },
  ],
  toggleFilter: (filterKey) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [filterKey]: !state.filters[filterKey],
      },
    })),
  toggleFavorite: (id) =>
    set((state) => ({
      places: state.places.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)),
    })),
}));
