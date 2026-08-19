import { get, post } from '@/api/client';

export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface CourseInvitationResponseDto {
  courseMemberId: number;
  courseId: number;
  courseName: string;
  courseDescription: string;
  inviterName: string;
  inviterEmail: string;
  createdAt: string;
  status: InviteStatus;
}

export interface CourseInvitationExistenceResponseDto {
  hasPendingInvitations: boolean;
}

/** GET /courses/invitations — 내가 받은 초대 목록 */
export function getMyInvitations() {
  return get<CourseInvitationResponseDto[]>('/courses/invitations');
}

/** GET /courses/invitations/exists — 대기 중인 초대 존재 여부 */
export function hasPendingInvitations() {
  return get<CourseInvitationExistenceResponseDto>('/courses/invitations/exists');
}

/** POST /courses/invitations — 이메일로 멤버 초대 */
export function inviteMember(courseId: number, email: string) {
  return post<string>('/courses/invitations', { courseId, email });
}

/** POST /courses/invitations/{courseMemberId}/accept — 초대 수락 */
export function acceptInvitation(courseMemberId: number) {
  return post<string>(`/courses/invitations/${courseMemberId}/accept`, {});
}

/** POST /courses/invitations/{courseMemberId}/reject — 초대 거절 */
export function rejectInvitation(courseMemberId: number) {
  return post<string>(`/courses/invitations/${courseMemberId}/reject`, {});
}