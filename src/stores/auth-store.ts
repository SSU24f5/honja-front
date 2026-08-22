import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  profileImage: string;
  setToken: (token: string) => void;
  clearToken: () => void;
  setProfileImage: (image: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 개발 중 자동 로그인이 필요하다면 null 대신 'mock-token'을 설정하세요.
  accessToken: null,
  profileImage: 'https://i.pravatar.cc/150?img=34', // Default profile image
  setToken: (token) => set({ accessToken: token }),
  clearToken: () => set({ accessToken: null }),
  setProfileImage: (image) => set({ profileImage: image }),
}));
