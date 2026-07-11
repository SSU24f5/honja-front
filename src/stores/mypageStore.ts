import { create } from 'zustand';

export interface Stamp {
  id: string;
  name: string;
  earned: boolean;
  earnedAt?: string;
}

interface MyPageState {
  visitCount: number;
  profileName: string;
  profileImage: string;
  stamps: Stamp[];
  incrementVisit: () => void;
  decrementVisit: () => void;
  updateProfile: (name: string, image: string) => void;
  toggleStamp: (id: string) => void;
}

export const useMyPageStore = create<MyPageState>((set) => ({
  visitCount: 3,
  profileName: '제주 여행가',
  profileImage: 'orange', // Profile avatar options: 'orange', 'palm', 'stone', 'hallasan'
  stamps: [
    { id: 'stamp-1', name: '한라산 정상 정복', earned: true, earnedAt: '2026-05-12' },
    { id: 'stamp-2', name: '성산일출봉 일출', earned: true, earnedAt: '2026-06-01' },
    { id: 'stamp-3', name: '우도 자전거 한바퀴', earned: false },
    { id: 'stamp-4', name: '용두암 일몰 감상', earned: false },
    { id: 'stamp-5', name: '섭지코지 유채꽃', earned: false },
    { id: 'stamp-6', name: '천제연 폭포 방문', earned: false },
  ],
  incrementVisit: () => set((state) => ({ visitCount: state.visitCount + 1 })),
  decrementVisit: () => set((state) => ({ visitCount: Math.max(0, state.visitCount - 1) })),
  updateProfile: (name, image) => set({ profileName: name, profileImage: image }),
  toggleStamp: (id) =>
    set((state) => ({
      stamps: state.stamps.map((s) =>
        s.id === id
          ? {
              ...s,
              earned: !s.earned,
              earnedAt: !s.earned ? new Date().toISOString().split('T')[0] : undefined,
            }
          : s,
      ),
    })),
}));
