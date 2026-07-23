import { useHomeStore } from '../homeStore';

describe('useHomeStore', () => {
  beforeEach(() => {
    useHomeStore.setState({
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
      ],
    });
  });

  it('should have initial state', () => {
    const state = useHomeStore.getState();
    expect(state.weather.temp).toBe(24);
    expect(state.trails.length).toBe(2);
  });

  it('should update weather data', () => {
    const newWeather = {
      temp: 18,
      condition: '구름많음',
      humidity: 75,
      windSpeed: 4.5,
    };

    useHomeStore.getState().setWeather(newWeather);
    expect(useHomeStore.getState().weather).toEqual(newWeather);
  });

  it('should toggle trail completion status', () => {
    const id = 'olle-1';
    expect(useHomeStore.getState().trails.find((t) => t.id === id)?.completed).toBe(false);

    useHomeStore.getState().toggleTrailCompleted(id);
    expect(useHomeStore.getState().trails.find((t) => t.id === id)?.completed).toBe(true);

    useHomeStore.getState().toggleTrailCompleted(id);
    expect(useHomeStore.getState().trails.find((t) => t.id === id)?.completed).toBe(false);
  });
});
