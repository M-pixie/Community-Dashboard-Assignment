'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActivityIcon, Calendar, Heart, LogIn, MessageSquare, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function ActivityPage() {
  const [filterType, setFilterType] = useState('All');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['activities', page, filterType],
    queryFn: async () => {
      const res = await api.get(`/activities?page=${page}&limit=20&type=${filterType}`);
      return res;
    }
  });

  const activities = (data as any)?.data || [];
  const pagination = (data as any)?.pagination;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Post': return <MessageSquare className="h-4 w-4 text-sky-500" />;
      case 'Comment': return <MessageSquare className="h-4 w-4 text-violet-500" />;
      case 'Reaction': return <Heart className="h-4 w-4 text-rose-500" />;
      case 'Login': return <LogIn className="h-4 w-4 text-emerald-500" />;
      case 'Event_RSVP': return <Calendar className="h-4 w-4 text-amber-500" />;
      default: return <ActivityIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Activity</h1>
          <p className="text-muted-foreground mt-1">Timeline of all community events and interactions.</p>
        </div>
        <div className="w-full sm:w-[200px]">
          <Select
  value={filterType}
  onValueChange={(val) => {
    if (val !== null) {
      setFilterType(val);
      setPage(1);
    }
  }}
>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Activities</SelectItem>
              <SelectItem value="Post">Posts</SelectItem>
              <SelectItem value="Comment">Comments</SelectItem>
              <SelectItem value="Reaction">Reactions</SelectItem>
              <SelectItem value="Login">Logins</SelectItem>
              <SelectItem value="Event_RSVP">Event RSVPs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardContent className="p-6">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', Posts: 12, Logins: 45, RSVPs: 8 },
                { name: 'Tue', Posts: 18, Logins: 52, RSVPs: 12 },
                { name: 'Wed', Posts: 15, Logins: 48, RSVPs: 5 },
                { name: 'Thu', Posts: 24, Logins: 61, RSVPs: 19 },
                { name: 'Fri', Posts: 30, Logins: 75, RSVPs: 25 },
                { name: 'Sat', Posts: 45, Logins: 89, RSVPs: 40 },
                { name: 'Sun', Posts: 38, Logins: 72, RSVPs: 35 },
              ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                />
                <Bar dataKey="Posts" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Logins" stackId="a" fill="#10b981" />
                <Bar dataKey="RSVPs" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 border border-dashed rounded-lg">
              No activities found.
            </div>
          ) : (
            <div className="space-y-0 sm:space-y-6 relative before:hidden sm:before:block before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border before:to-transparent sm:pt-4">
              {activities.map((activity: any) => (
                <div key={activity._id} className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active border-b sm:border-0 p-4 sm:p-0">
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="w-full sm:w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] sm:p-4 sm:rounded-xl sm:border bg-card sm:shadow-sm sm:hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border shadow-sm sm:hidden">
                        <AvatarImage src={activity.userId?.avatar} />
                        <AvatarFallback>{activity.userId?.name?.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border hidden sm:block">
                              <AvatarImage src={activity.userId?.avatar} />
                              <AvatarFallback>{activity.userId?.name?.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-sm">{activity.userId?.name || 'Unknown User'}</span>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium shrink-0">
                            {format(new Date(activity.timestamp), 'MMM d, p')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-[10px] uppercase shrink-0">
                            {activity.type.replace('_', ' ')}
                          </Badge>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button 
            variant="outline" 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Button 
            variant="outline" 
            disabled={page === pagination.totalPages}
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
