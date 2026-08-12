import { get, post } from '@/api/client';

// 약관 하나의 형태 (백엔드 TermResDTO와 동일)
export interface Term {
  id: number;
  title: string;
  content: string;
  isRequired: boolean;
}

// 약관 목록 조회
export function getTerms() {
  return get<Term[]>('/terms');
}

// 이메일 인증코드 발송
export function sendEmailCode(email: string) {
  return post<null>('/auth/email/send', { email });
}

// 회원가입
export interface SignUpParams {
  email: string;
  authCode: string;
  nickname: string;
  password: string;
  agreedTermIds: number[];
}
export function signUp(params: SignUpParams) {
  return post<{ id: number; createdAt: string }>('/users/signup', params);
}

// 로그인
export function login(email: string, password: string) {
  return post<{ accessToken: string }>('/users/login', { email, password });
}
