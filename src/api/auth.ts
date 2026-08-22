import { get, post, patch, del } from '@/api/client';

// ── 약관 ──

export interface Term {
  id: number;
  title: string;
  content: string;
  isRequired: boolean;
}

/** GET /terms — 전체 약관 목록 조회 */
export function getTerms() {
  return get<Term[]>('/terms');
}

/** GET /terms/me — 내가 동의한 약관 목록 조회 */
export function getMyAgreedTerms() {
  return get<Term[]>('/terms/me');
}

// ── 이메일 인증 ──

/** POST /auth/email/send — 이메일 인증코드 발송 */
export function sendEmailCode(email: string) {
  return post<null>('/auth/email/send', { email });
}

// ── 회원가입 / 로그인 ──

export interface SignUpParams {
  email: string;
  authCode: string;
  nickname: string;
  password: string;
  agreedTermIds: number[];
}

/** POST /users/signup */
export function signUp(params: SignUpParams) {
  return post<{ id: number; createdAt: string }>('/users/signup', params);
}

/** POST /users/login */
export function login(email: string, password: string) {
  return post<{ accessToken: string }>('/users/login', { email, password });
}

// ── 프로필 수정 / 계정 삭제 ──

export interface UpdateProfileParams {
  nickname?: string;
  email?: string;
  code?: string;
}

export interface UpdateProfileResult {
  nickname: string;
  email: string;
  code: string;
}

/** PATCH /users/profile — 프로필 수정 (닉네임, 이메일 변경) */
export function updateProfile(params: UpdateProfileParams) {
  return patch<UpdateProfileResult>('/users/profile', params);
}

/** DELETE /users/delete — 계정 삭제 */
export function deleteUser() {
  return del<{}>('/users/delete');
}
