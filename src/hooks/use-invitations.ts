import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptInvitation,
  getReceivedInvitations,
  getSentInvitations,
  rejectInvitation,
} from '@/api/invitation';
import { MY_COURSES_QUERY_KEY } from './use-my-courses';

export const RECEIVED_INVITATIONS_QUERY_KEY = ['invitations', 'received'] as const;
export const SENT_INVITATIONS_QUERY_KEY = ['invitations', 'sent'] as const;

export function useReceivedInvitations() {
  return useQuery({
    queryKey: RECEIVED_INVITATIONS_QUERY_KEY,
    queryFn: getReceivedInvitations,
  });
}

export function useSentInvitations() {
  return useQuery({
    queryKey: SENT_INVITATIONS_QUERY_KEY,
    queryFn: getSentInvitations,
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: number) => acceptInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECEIVED_INVITATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_COURSES_QUERY_KEY });
    },
  });
}

export function useRejectInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: number) => rejectInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECEIVED_INVITATIONS_QUERY_KEY });
    },
  });
}