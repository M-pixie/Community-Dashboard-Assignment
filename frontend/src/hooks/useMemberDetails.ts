import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Member } from './useMembers';

export interface Activity {
  _id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
}

export interface MemberDetailsResponse {
  member: Member;
  activities: Activity[];
  events: Event[];
}

export function useMemberDetails(id: string) {
  return useQuery<MemberDetailsResponse>({
    queryKey: ['member', id],
    queryFn: () => api.get(`/members/${id}`),
    enabled: !!id,
  });
}
