import { get, post } from '@/api/client';

export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface CourseInvitationResponseDto {
  courseMemberId: number;
  courseId: number;
  courseName: string;
  courseDescription: string;
  counterpartNickname: string;
  counterpartEmail: string;
  createdAt: string;
  status: InviteStatus;
}

export function getReceivedInvitations(): Promise<CourseInvitationResponseDto[]> {
  return get<CourseInvitationResponseDto[]>('/invitations/received');
}

export function getSentInvitations(): Promise<CourseInvitationResponseDto[]> {
  return get<CourseInvitationResponseDto[]>('/invitations/sent');
}

export function acceptInvitation(invitationId: number): Promise<void> {
  return post<void>(`/invitations/${invitationId}/accept`, undefined);
}

export function rejectInvitation(invitationId: number): Promise<void> {
  return post<void>(`/invitations/${invitationId}/reject`, undefined);
}