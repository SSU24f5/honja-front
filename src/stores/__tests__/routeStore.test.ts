import { useRouteStore } from '../routeStore';

describe('useRouteStore', () => {
  beforeEach(() => {
    useRouteStore.setState({
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
    });
  });

  it('should add recommended place to itinerary', () => {
    const place = {
      id: 'rec-1',
      name: '오설록 티 뮤지엄',
      category: '체험',
      address: '제주 안덕면 신화역사로 15',
    };
    useRouteStore.getState().addPlaceToRoute(place);

    expect(useRouteStore.getState().itinerary.length).toBe(4);
    expect(useRouteStore.getState().itinerary.some((p) => p.id === 'rec-1')).toBe(true);
    expect(useRouteStore.getState().recommendations.some((p) => p.id === 'rec-1')).toBe(false);
  });

  it('should remove place from itinerary', () => {
    useRouteStore.getState().removePlaceFromRoute('route-p2');

    expect(useRouteStore.getState().itinerary.length).toBe(2);
    expect(useRouteStore.getState().itinerary.some((p) => p.id === 'route-p2')).toBe(false);
    expect(useRouteStore.getState().recommendations.some((p) => p.id === 'route-p2')).toBe(true);
  });

  it('should move place up in itinerary', () => {
    // Before move: index 1 is 함덕 해수욕장, index 0 is 제주국제공항
    expect(useRouteStore.getState().itinerary[1].id).toBe('route-p2');
    expect(useRouteStore.getState().itinerary[0].id).toBe('route-p1');

    useRouteStore.getState().movePlaceUp(1);

    // After move: index 0 should be 함덕 해수욕장, index 1 should be 제주국제공항
    expect(useRouteStore.getState().itinerary[0].id).toBe('route-p2');
    expect(useRouteStore.getState().itinerary[1].id).toBe('route-p1');
  });

  it('should move place down in itinerary', () => {
    // Before move: index 1 is 함덕 해수욕장, index 2 is 에코랜드
    expect(useRouteStore.getState().itinerary[1].id).toBe('route-p2');
    expect(useRouteStore.getState().itinerary[2].id).toBe('route-p3');

    useRouteStore.getState().movePlaceDown(1);

    // After move: index 2 should be 함덕 해수욕장, index 1 should be 에코랜드
    expect(useRouteStore.getState().itinerary[2].id).toBe('route-p2');
    expect(useRouteStore.getState().itinerary[1].id).toBe('route-p3');
  });
});
