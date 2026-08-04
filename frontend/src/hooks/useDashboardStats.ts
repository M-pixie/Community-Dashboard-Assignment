import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  averageEngagementScore: number;
  engagementDistribution: { name: string; value: number }[];
  activityOverTime: { date: string; count: number }[];
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: () => api.get('/dashboard'),
  });
}
