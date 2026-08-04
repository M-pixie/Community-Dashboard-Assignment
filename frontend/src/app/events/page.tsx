'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, MapPin, Users, Loader2, Plus, Search, Filter, LayoutGrid, List, MoreVertical, Copy, Edit2, Trash2, ExternalLink, CalendarRange, CheckCircle2, Ticket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { EventModal } from '@/components/events/EventModal';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function EventsPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ['events', search, statusFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      
      const res = await api.get(`/events?${params.toString()}`);
      return res; // api.ts already returns response.data
    }
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      refetch();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.post(`/events/${id}/duplicate`);
      toast.success('Event duplicated');
      refetch();
    } catch (e) {
      toast.error('Failed to duplicate');
    }
  };

  const openEditModal = (event: any) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div whileHover={{ y: -2 }} className="bg-background rounded-xl p-5 border border-border/50 shadow-sm relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-8 bg-gradient-to-br ${color} opacity-20 rounded-bl-[100px] transition-transform group-hover:scale-110`} />
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color} text-white shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none">{trend}</Badge>}
      </div>
      <div>
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </motion.div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Ongoing': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Past': return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'Draft': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const events = data?.events || [];
  const stats = data?.stats || { total: 0, upcoming: 0, past: 0, totalRegistrations: 0 };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize, track, and analyze community events.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex shadow-sm">Import</Button>
          <Button onClick={openCreateModal} className="shadow-sm shadow-primary/20 hover:shadow-primary/30 transition-shadow">
            <Plus className="h-4 w-4 mr-2" /> Create Event
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Events" value={stats.total} icon={CalendarRange} color="from-primary to-blue-600" />
        <StatCard title="Upcoming" value={stats.upcoming} icon={Calendar} color="from-emerald-500 to-teal-600" trend="+2 this week" />
        <StatCard title="Total Registrations" value={stats.totalRegistrations} icon={Users} color="from-purple-500 to-indigo-600" />
        <StatCard title="Past Events" value={stats.past} icon={CheckCircle2} color="from-zinc-500 to-zinc-700" />
      </div>

      {/* Toolbar */}
      <div className="bg-background border border-border/50 rounded-2xl p-2 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search events..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/30 border-none shadow-none focus-visible:ring-1" 
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-muted/30 border-none shadow-none">
              <div className="flex items-center gap-2"><Filter className="h-3 w-3"/> <SelectValue placeholder="Status" /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Past">Past</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewMode('grid')} 
            className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewMode('list')} 
            className={`h-8 w-8 ${viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm font-medium">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 text-center px-4 border border-dashed border-border/60 rounded-3xl bg-muted/10">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Ticket className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No events found</h2>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            {search || statusFilter !== 'all' ? "We couldn't find any events matching your current filters. Try adjusting them." : "Your community dashboard is looking a bit empty. Create your first event to get started!"}
          </p>
          <Button onClick={openCreateModal} size="lg" className="rounded-full shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5 mr-2" /> Create First Event
          </Button>
        </motion.div>
      ) : (
        <div className={viewMode === 'grid' ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
          <AnimatePresence>
            {events.map((event: any, index: number) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className={`group h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center'}`}>
                  
                  {/* Event Banner */}
                  <div className={`${viewMode === 'grid' ? 'h-40 w-full' : 'h-32 w-48 shrink-0'} bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden`}>
                    {event.bannerImage ? (
                      <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="h-10 w-10 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className={`${getStatusColor(event.status)} border backdrop-blur-md`}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>

                  <div className={`flex-1 flex flex-col ${viewMode === 'grid' ? 'p-5' : 'p-5'}`}>
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <Link href={`/events/${event._id}`} className="hover:underline">
                        <h3 className="font-bold text-lg leading-tight line-clamp-1">{event.title}</h3>
                      </Link>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem onClick={() => window.location.href=`/events/${event._id}`}><ExternalLink className="h-4 w-4 mr-2"/> View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(event)}><Edit2 className="h-4 w-4 mr-2"/> Edit Event</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(event._id)}><Copy className="h-4 w-4 mr-2"/> Duplicate</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(event._id)} className="text-destructive focus:bg-destructive/10"><Trash2 className="h-4 w-4 mr-2"/> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                      {event.shortDescription || event.description || "No description provided."}
                    </p>

                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
                        {event.date ? format(parseISO(event.date), 'MMM d, yyyy') : 'No date'} 
                        {event.startTime && ` • ${event.startTime}`}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-2 text-primary" />
                        <span className="truncate">{event.venue || event.onlineMeetingLink || 'TBA'}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`bg-muted/10 border-border/50 flex items-center justify-between ${viewMode === 'grid' ? 'border-t p-4' : 'border-l p-4 flex-col w-40 h-full justify-center gap-3 shrink-0'}`}>
                    <div className={`flex -space-x-2 ${viewMode === 'list' ? 'justify-center w-full' : ''}`}>
                      {event.participants?.slice(0, 3).map((p: any, i: number) => (
                        <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-muted overflow-hidden">
                           {p.avatar ? <img src={p.avatar} alt="avatar" /> : <div className="h-full w-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{p.name?.[0]}</div>}
                        </div>
                      ))}
                      {(event.participants?.length || 0) > 3 && (
                        <div className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium">
                          +{event.participants.length - 3}
                        </div>
                      )}
                      {(event.participants?.length || 0) === 0 && (
                         <span className="text-xs text-muted-foreground ml-2">No attendees yet</span>
                      )}
                    </div>
                    
                    {viewMode === 'grid' && (
                      <div className="text-xs font-medium text-muted-foreground">
                        {event.maxSeats > 0 ? `${event.participants?.length || 0}/${event.maxSeats} seats` : `${event.participants?.length || 0} attending`}
                      </div>
                    )}
                    {viewMode === 'list' && (
                       <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => window.location.href=`/events/${event._id}`}>View</Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Forms Modal */}
      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        eventToEdit={eventToEdit}
        onSuccess={refetch}
      />
    </div>
  );
}
