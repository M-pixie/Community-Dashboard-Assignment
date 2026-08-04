'use client';

import { useMemberDetails } from '@/hooks/useMemberDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Calendar, Activity as ActivityIcon, MessageSquare, Heart, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter, useParams } from 'next/navigation';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer, 
  PolarAngleAxis 
} from 'recharts';

export default function MemberProfile() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useMemberDetails(id);

  if (isError) {
    return <div className="text-red-500">Error loading member details.</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-24 mb-6" />
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 text-center md:text-left">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px] lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!data?.member) return <div>Member not found</div>;

  const { member, activities, events } = data;

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

  const scoreData = [{ name: 'Score', value: member.engagementScore, fill: member.engagementScore > 75 ? '#10b981' : member.engagementScore < 40 ? '#f43f5e' : '#0ea5e9' }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <Button variant="ghost" onClick={() => router.back()} className="mb-2 -ml-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Members
      </Button>

      {/* Header Card Using CSS Grid */}
      <Card className="overflow-hidden border shadow-sm bg-card">
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Avatar & Info Area (Takes up most of the space on desktop) */}
            <div className="md:col-span-8 lg:col-span-9 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-lg shrink-0">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-3xl">{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{member.name}</h1>
                  <Badge variant={member.status === 'Active' ? 'default' : 'secondary'} className={
                    member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 shrink-0' : 'bg-rose-500/10 text-rose-500 shrink-0'
                  }>
                    {member.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start text-muted-foreground gap-2 truncate">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm text-muted-foreground mt-2 bg-muted/30 p-3 rounded-lg w-fit mx-auto sm:mx-0 border">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-primary" />
                    <span className="font-medium text-foreground">Joined:</span> {format(new Date(member.joinedDate), 'MMM d, yyyy')}
                  </span>
                  <span className="hidden sm:inline text-border">•</span>
                  <span className="flex items-center gap-2">
                    <ActivityIcon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="font-medium text-foreground">Last active:</span> {format(new Date(member.lastLogin), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Engagement Score Radial (Takes up remaining space, won't overlap) */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l pt-6 md:pt-0 border-border/50">
              <span className="text-sm font-semibold text-muted-foreground mb-[-10px] z-10 uppercase tracking-wider">Engagement</span>
              <div className="h-[140px] w-[140px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="75%" 
                    outerRadius="100%" 
                    data={scoreData} 
                    startAngle={90} 
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold tracking-tighter">{member.engagementScore}</span>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Recent Activity Timeline */}
        <Card className="md:col-span-12 lg:col-span-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-muted-foreground text-center py-12 bg-muted/20 rounded-lg border border-dashed">No recent activity</div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border before:to-transparent pt-4">
                {activities.map((activity, index) => (
                  <div key={activity._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm capitalize">{activity.type.replace('_', ' ')}</span>
                        <span className="text-xs text-muted-foreground font-medium">{format(new Date(activity.timestamp), 'MMM d, p')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events Participated */}
        <Card className="md:col-span-12 lg:col-span-4 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Events Participated
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-muted-foreground text-center py-8 bg-muted/20 rounded-lg border border-dashed">No events participated</div>
            ) : (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li key={event._id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border shadow-sm group cursor-pointer">
                    <div className="bg-primary/10 text-primary rounded-lg p-2 flex flex-col items-center justify-center min-w-[56px] group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <span className="text-xs font-bold uppercase leading-none">{format(new Date(event.date), 'MMM')}</span>
                      <span className="text-lg font-bold leading-none mt-1">{format(new Date(event.date), 'd')}</span>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold leading-tight line-clamp-2">{event.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(event.date), 'yyyy')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
