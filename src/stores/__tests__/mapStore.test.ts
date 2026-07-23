import { useMapStore } from '../mapStore';

describe('useMapStore', () => {
  beforeEach(() => {
    useMapStore.setState({
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
          favorite: false,
        },
      ],
    });
  });

  it('should have initial state', () => {
    const state = useMapStore.getState();
    expect(state.filters.barrierFree).toBe(false);
    expect(state.places.length).toBe(2);
  });

  it('should toggle filter correctly', () => {
    expect(useMapStore.getState().filters.barrierFree).toBe(false);

    useMapStore.getState().toggleFilter('barrierFree');
    expect(useMapStore.getState().filters.barrierFree).toBe(true);

    useMapStore.getState().toggleFilter('barrierFree');
    expect(useMapStore.getState().filters.barrierFree).toBe(false);
  });

  it('should toggle favorite status of place', () => {
    const id = 'place-2';
    expect(useMapStore.getState().places.find((p) => p.id === id)?.favorite).toBe(false);

    useMapStore.getState().toggleFavorite(id);
    expect(useMapStore.getState().places.find((p) => p.id === id)?.favorite).toBe(true);

    useMapStore.getState().toggleFavorite(id);
    expect(useMapStore.getState().places.find((p) => p.id === id)?.favorite).toBe(false);
  });
});
