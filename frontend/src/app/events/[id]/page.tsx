'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, MapPin, Users, Loader2, Link as LinkIcon, Share2, Edit2, Clock, Globe } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isRSVPing, setIsRSVPing] = useState(false);

  const { data: event, isLoading, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}`);
      return res;
    }
  });

  const isAttending = event?.participants?.some((p: any) => p._id === user?._id || p === user?._id);

  const handleRSVP = async () => {
    if (!user) {
      toast.error('Please login to RSVP');
      router.push('/login');
      return;
    }
    
    setIsRSVPing(true);
    try {
      await api.post(`/events/${id}/rsvp`);
      toast.success(isAttending ? 'RSVP Cancelled' : 'RSVP Successful!');
      refetch();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to RSVP');
    } finally {
      setIsRSVPing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">The event you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push('/events')}>Back to Events</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Ongoing': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Past': return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push('/events')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="shadow-sm">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button size="sm" className="shadow-sm shadow-primary/20">
            <Edit2 className="h-4 w-4 mr-2" /> Edit Event
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden relative mb-8 shadow-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-border/50"
      >
        {event.bannerImage ? (
          <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="h-20 w-20 text-primary/20" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
          <div className="flex gap-2 mb-4">
            <Badge className={`${getStatusColor(event.status)} backdrop-blur-md border`}>{event.status}</Badge>
            <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md">{event.category || 'General'}</Badge>
            {event.visibility === 'Private' && <Badge variant="outline" className="bg-rose-500/50 text-white border-rose-500/20 backdrop-blur-md">Private</Badge>}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
            {event.title}
          </h1>
          <p className="text-lg text-white/80 max-w-3xl line-clamp-2">
            {event.shortDescription || event.description || 'No description available for this event.'}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
              <TabsTrigger value="about" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold">About</TabsTrigger>
              <TabsTrigger value="discussion" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold">Discussion</TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-6">
              <div className="bg-transparent">
                <div className="p-0">
                  <h3 className="text-xl font-bold mb-4">Event Description</h3>
                  {event.description ? (
                    <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed break-words overflow-hidden">
                      {event.description}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No detailed description provided.</p>
                  )}

                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-border/50">
                      <h4 className="text-sm font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-muted/50">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discussion">
              <div className="text-center py-12 border border-dashed border-border/60 rounded-2xl bg-muted/10">
                <p className="text-muted-foreground">Discussions feature coming soon.</p>
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <div className="text-center py-12 border border-dashed border-border/60 rounded-2xl bg-muted/10">
                <p className="text-muted-foreground">Files and gallery feature coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>

        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.date ? format(parseISO(event.date), 'EEEE, MMMM d, yyyy') : 'No Date Set'}</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {event.startTime || 'Time TBD'} {event.endTime ? `- ${event.endTime}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.venue || 'Virtual / Online'}</p>
                    {event.venue && <a href="#" className="text-xs text-primary hover:underline mt-1 inline-block">View Map</a>}
                  </div>
                </div>

                {event.onlineMeetingLink && (
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Online Meeting</p>
                      <a href={event.onlineMeetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 break-all line-clamp-1 inline-block">
                        {event.onlineMeetingLink}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border/50">
                <Button 
                  onClick={handleRSVP}
                  disabled={isRSVPing || (!isAttending && event.maxSeats > 0 && (event.participants?.length || 0) >= event.maxSeats)}
                  variant={isAttending ? "secondary" : "default"}
                  className="w-full py-6 text-lg font-semibold shadow-lg shadow-primary/20"
                >
                  {isRSVPing ? <Loader2 className="h-5 w-5 animate-spin" /> : isAttending ? 'Cancel RSVP' : 'RSVP for Event'}
                </Button>
                {event.maxSeats > 0 && (
                   <p className="text-center text-xs text-muted-foreground mt-3">
                     {event.maxSeats - (event.participants?.length || 0)} seats remaining
                   </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center justify-between">
                <span>Attendees</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {event.participants?.length || 0} registered
                </span>
              </h3>
              
              {event.participants?.length > 0 ? (
                <div className="space-y-4">
                  {event.participants.slice(0, 5).map((p: any) => (
                    <div key={p._id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                        {p.avatar ? (
                          <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {p.name?.[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{p.email || 'Member'}</p>
                      </div>
                    </div>
                  ))}
                  {event.participants.length > 5 && (
                    <Button variant="outline" className="w-full text-xs h-8">
                      View all {event.participants.length} attendees
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed border-border/50">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">Be the first to register!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-muted/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0">
                {event.organizer?.avatar ? (
                  <img src={event.organizer.avatar} alt="Organizer" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {event.organizer?.name?.[0] || 'O'}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Organized by</p>
                <p className="text-sm font-bold">{event.organizer?.name || 'Community Admin'}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto text-xs h-8">Contact</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
