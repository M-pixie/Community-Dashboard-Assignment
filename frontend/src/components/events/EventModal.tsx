'use client';

import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, CalendarIcon, Clock, MapPin, Link as LinkIcon, Users, Tag } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: any;
  onSuccess: () => void;
}

export function EventModal({ isOpen, onClose, eventToEdit, onSuccess }: EventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'General',
    date: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    onlineMeetingLink: '',
    maxSeats: 0,
    status: 'Upcoming',
    visibility: 'Public',
    tags: '',
    bannerImage: ''
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        shortDescription: eventToEdit.shortDescription || '',
        description: eventToEdit.description || '',
        category: eventToEdit.category || 'General',
        date: eventToEdit.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : '',
        endDate: eventToEdit.endDate ? new Date(eventToEdit.endDate).toISOString().split('T')[0] : '',
        startTime: eventToEdit.startTime || '',
        endTime: eventToEdit.endTime || '',
        venue: eventToEdit.venue || '',
        onlineMeetingLink: eventToEdit.onlineMeetingLink || '',
        maxSeats: eventToEdit.maxSeats || 0,
        status: eventToEdit.status || 'Upcoming',
        visibility: eventToEdit.visibility || 'Public',
        tags: eventToEdit.tags ? eventToEdit.tags.join(', ') : '',
        bannerImage: eventToEdit.bannerImage || ''
      });
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        category: 'General',
        date: '',
        endDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        onlineMeetingLink: '',
        maxSeats: 0,
        status: 'Upcoming',
        visibility: 'Public',
        tags: '',
        bannerImage: ''
      });
    }
  }, [eventToEdit, isOpen]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, bannerImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : []
      };

      // Clean up empty fields to prevent Mongoose CastErrors
      if (!payload.endDate) delete payload.endDate;
      if (!payload.date) delete payload.date;
      if (payload.maxSeats === '') payload.maxSeats = 0;

      if (eventToEdit) {
        await api.put(`/events/${eventToEdit._id}`, payload);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', payload);
        toast.success('Event created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Full Error:", error);
      console.error("Response Data:", error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto bg-background/95 backdrop-blur-xl border-l-border/50 p-6 sm:p-8">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">{eventToEdit ? 'Edit Event' : 'Create New Event'}</SheetTitle>
          <SheetDescription>
            {eventToEdit ? 'Update the details of your event below.' : 'Fill out the details below to publish a new event.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pb-10">
          
          {/* Banner Upload Placeholder */}
          <div className="space-y-2">
            <Label>Event Banner</Label>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }}
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            <div 
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="h-40 w-full rounded-xl border-2 border-dashed border-border/50 bg-muted/20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors group relative overflow-hidden"
            >
              {formData.bannerImage ? (
                <>
                  <img src={formData.bannerImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white font-medium flex items-center gap-2"><Upload className="h-5 w-5" /> Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2 pointer-events-none" />
                  <span className="text-sm text-muted-foreground font-medium pointer-events-none">Click to upload banner image</span>
                  <span className="text-xs text-muted-foreground/60 mt-1 pointer-events-none">1920x1080 recommended</span>
                </>
              )}
            </div>
            <Input 
              placeholder="Or paste an image URL here..." 
              name="bannerImage" 
              value={formData.bannerImage} 
              onChange={handleChange}
              className="mt-2 text-xs"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Event Title <span className="text-destructive">*</span></Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Annual Tech Conference 2026" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Summary</Label>
              <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="A quick one-liner about the event" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Meetup">Meetup</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={formData.visibility} onValueChange={(v) => handleSelectChange('visibility', v)}>
                  <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public (Everyone)</SelectItem>
                    <SelectItem value="Private">Private (Invite Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Date & Time</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Start Date <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="pl-9" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} className="pl-9" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Location & Attendance</h3>
            
            <div className="space-y-2">
              <Label htmlFor="venue">Venue / Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="venue" name="venue" value={formData.venue} onChange={handleChange} placeholder="Physical location if any" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="onlineMeetingLink">Meeting Link</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="onlineMeetingLink" name="onlineMeetingLink" value={formData.onlineMeetingLink} onChange={handleChange} placeholder="https://zoom.us/..." className="pl-9" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxSeats">Max Seats (0 = Unlimited)</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="maxSeats" name="maxSeats" type="number" min="0" value={formData.maxSeats} onChange={handleChange} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Past">Past</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="tech, networking, annual" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="min-h-[150px] resize-y bg-muted/20"
                placeholder="Write a detailed description of the event..."
              />
            </div>
          </div>

          <SheetFooter className="sticky bottom-0 bg-background/95 backdrop-blur pt-4 pb-2 border-t border-border/50">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {eventToEdit ? 'Save Changes' : 'Create Event'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
