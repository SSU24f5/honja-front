import { create } from 'zustand';

export interface OlleTrail {
  id: string;
  name: string;
  courseNumber: number;
  distance: string;
  difficulty: '상' | '중' | '하';
  description: string;
  completed: boolean;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface HomeState {
  weather: WeatherData;
  trails: OlleTrail[];
  setWeather: (weather: WeatherData) => void;
  toggleTrailCompleted: (id: string) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  weather: {
    temp: 24,
    condition: '맑음',
    humidity: 60,
    windSpeed: 3.2,
  },
  trails: [
    {
      id: 'olle-1',
      name: '시흥 - 광치기 올레',
      courseNumber: 1,
      distance: '15.0km',
      difficulty: '중',
      description: '오름과 바다가 이어지는 첫 번째 여정',
      completed: false,
    },
    {
      id: 'olle-7',
      name: '외돌개 - 월평 올레',
      courseNumber: 7,
      distance: '17.6km',
      difficulty: '상',
      description: '해안 절경과 숲길이 어우러지는 코스',
      completed: false,
    },
    {
      id: 'olle-10',
      name: '화순 - 하모 올레',
      courseNumber: 10,
      distance: '15.6km',
      difficulty: '하',
      description: '송악산과 사계해안을 따라 걷는 길',
      completed: false,
    },
  ],
  setWeather: (weather) => set({ weather }),
  toggleTrailCompleted: (id) =>
    set((state) => ({
      trails: state.trails.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),
}));
