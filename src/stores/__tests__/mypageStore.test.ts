import { useMyPageStore } from '../mypageStore';

describe('useMyPageStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useMyPageStore.setState({
      visitCount: 3,
      profileName: '제주 여행가',
      profileImage: 'orange',
      stamps: [
        { id: 'stamp-1', name: '한라산 정상 정복', earned: true, earnedAt: '2026-05-12' },
        { id: 'stamp-2', name: '성산일출봉 일출', earned: true, earnedAt: '2026-06-01' },
        { id: 'stamp-3', name: '우도 자전거 한바퀴', earned: false },
        { id: 'stamp-4', name: '용두암 일몰 감상', earned: false },
        { id: 'stamp-5', name: '섭지코지 유채꽃', earned: false },
        { id: 'stamp-6', name: '천제연 폭포 방문', earned: false },
      ],
    });
  });

  it('should have initial values', () => {
    const state = useMyPageStore.getState();
    expect(state.visitCount).toBe(3);
    expect(state.profileName).toBe('제주 여행가');
    expect(state.profileImage).toBe('orange');
  });

  it('should increment visit count', () => {
    useMyPageStore.getState().incrementVisit();
    expect(useMyPageStore.getState().visitCount).toBe(4);
  });

  it('should decrement visit count', () => {
    useMyPageStore.getState().decrementVisit();
    expect(useMyPageStore.getState().visitCount).toBe(2);
  });

  it('should not decrement visit count below 0', () => {
    useMyPageStore.setState({ visitCount: 0 });
    useMyPageStore.getState().decrementVisit();
    expect(useMyPageStore.getState().visitCount).toBe(0);
  });

  it('should update profile name and image', () => {
    useMyPageStore.getState().updateProfile('새로운 여행가', 'stone');
    expect(useMyPageStore.getState().profileName).toBe('새로운 여행가');
    expect(useMyPageStore.getState().profileImage).toBe('stone');
  });

  it('should toggle stamp earned status', () => {
    const id = 'stamp-3';
    // Initially false
    expect(useMyPageStore.getState().stamps.find((s) => s.id === id)?.earned).toBe(false);

    // Toggle to true
    useMyPageStore.getState().toggleStamp(id);
    const stampAfter = useMyPageStore.getState().stamps.find((s) => s.id === id);
    expect(stampAfter?.earned).toBe(true);
    expect(stampAfter?.earnedAt).toBeDefined();

    // Toggle back to false
    useMyPageStore.getState().toggleStamp(id);
    expect(useMyPageStore.getState().stamps.find((s) => s.id === id)?.earned).toBe(false);
  });
});
