import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Member {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  lastActive: string;
  engagementScore: number;
  status: 'Active' | 'Inactive';
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MembersResponse {
  data: Member[];
  pagination: PaginationInfo;
}

interface UseMembersProps {
  page: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useMembers(params: UseMembersProps) {
  return useQuery<MembersResponse>({
    queryKey: ['members', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.status && params.status !== 'All') searchParams.append('status', params.status);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      return api.get(`/members?${searchParams.toString()}`);
    },
  });
}
