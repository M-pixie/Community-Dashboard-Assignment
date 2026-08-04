import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import mongoose from 'mongoose';

// Get all events with filtering, search, and pagination
export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      search = '', 
      status, 
      category, 
      sort = 'date',
      order = 'asc' 
    } = req.query;

    const query: any = {};

    // Apply Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply Filters
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;

    // Apply Sorting
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj: any = { [sort as string]: sortOrder };

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const events = await Event.find(query)
      .populate('organizer', 'name avatar email')
      .populate('participants', 'name avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber);

    const total = await Event.countDocuments(query);
    
    // Also return aggregate stats for the frontend dashboard
    const stats = {
      total: await Event.countDocuments(),
      upcoming: await Event.countDocuments({ status: 'Upcoming' }),
      past: await Event.countDocuments({ status: 'Past' }),
      cancelled: await Event.countDocuments({ status: 'Cancelled' }),
      totalRegistrations: (await Event.aggregate([
        { $project: { participantsCount: { $size: "$participants" } } },
        { $group: { _id: null, total: { $sum: "$participantsCount" } } }
      ]))[0]?.total || 0
    };

    res.json({
      events,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber)
      },
      stats
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar email')
      .populate('participants', 'name avatar email');
      
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    next(error);
  }
}

export const createEvent = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add logged-in user as organizer if not provided
    const eventData = {
      ...req.body,
      organizer: req.body.organizer || req.user._id
    };
    const newEvent = new Event(eventData);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const duplicateEvent = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const originalEvent = await Event.findById(req.params.id);
    if (!originalEvent) return res.status(404).json({ message: 'Event not found' });

    const eventObj = originalEvent.toObject();
    delete eventObj._id;
    delete eventObj.createdAt;
    delete eventObj.updatedAt;
    eventObj.title = `${eventObj.title} (Copy)`;
    eventObj.status = 'Draft';
    eventObj.participants = []; // Reset participants

    const newEvent = new Event(eventObj);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
}

export const rsvpEvent = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id;
    
    const participantIndex = event.participants.indexOf(userId);
    
    if (participantIndex === -1) {
      // Check max seats if not unlimited
      if (event.maxSeats && event.maxSeats > 0 && event.participants.length >= event.maxSeats) {
        return res.status(400).json({ message: 'Event is completely full' });
      }
      event.participants.push(userId);
    } else {
      // Allow un-RSVP (toggle)
      event.participants.splice(participantIndex, 1);
    }
    
    await event.save();
    res.json(event);
  } catch (error) {
    next(error);
  }
};
