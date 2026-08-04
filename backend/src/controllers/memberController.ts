import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Activity from '../models/Activity';
import Event from '../models/Event';

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const sortBy = (req.query.sortBy as string) || 'joinedDate';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 1 : -1;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      User.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.json({
      data: members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const member = await User.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const activities = await Activity.find({ userId: member._id })
      .sort({ timestamp: -1 })
      .limit(20);

    const events = await Event.find({ participants: member._id })
      .sort({ date: -1 });

    res.json({
      member,
      activities,
      events
    });
  } catch (error) {
    next(error);
  }
};
