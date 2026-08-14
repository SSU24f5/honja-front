import type { ImageSourcePropType } from 'react-native';
import { create } from 'zustand';

export interface Invitation {
  id: string;
  /** 동행유형 뱃지 예: '일반' / '배리어프리' / '애인과 함께' */
  tag: string;
  title: string;
  dateRangeText: string;
  /**
   * 참여자 아바타 이미지.
   * - 로컬 에셋: require('@/assets/avatars/xxx.png')
   * - 원격 이미지(임시 목업): { uri: 'https://...' }
   */
  avatars?: ImageSourcePropType[];
}

interface InvitationState {
  /** 내가 받은 초대 */
  receivedInvitations: Invitation[];
  /** 내가 보낸 초대 */
  sentInvitations: Invitation[];
  acceptInvitation: (id: string) => void;
  rejectInvitation: (id: string) => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  receivedInvitations: [
    {
      id: 'invite-1',
      tag: '일반',
      title: '혼자왓수다',
      dateRangeText: '26.07.10. ~ 26.07.14. (4박 5일)',
    },
    {
      id: 'invite-2',
      tag: '배리어프리',
      title: '셋이왓수다',
      dateRangeText: '26.07.10. ~ 26.07.14. (4박 5일)',
      avatars: [
        { uri: 'https://i.pravatar.cc/100?img=1' },
        { uri: 'https://i.pravatar.cc/100?img=2' },
      ],
    },
  ],
  sentInvitations: [
    {
      id: 'invite-3',
      tag: '애인과 함께',
      title: '둘이왓수다',
      dateRangeText: '26.07.10. ~ 26.07.14. (4박 5일)',
      avatars: [{ uri: 'https://i.pravatar.cc/100?img=3' }],
    },
  ],
  acceptInvitation: (id) =>
    set((state) => ({
      receivedInvitations: state.receivedInvitations.filter((inv) => inv.id !== id),
    })),
  rejectInvitation: (id) =>
    set((state) => ({
      receivedInvitations: state.receivedInvitations.filter((inv) => inv.id !== id),
    })),
}));