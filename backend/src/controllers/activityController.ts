import { Request, Response, NextFunction } from 'express';
import Activity from '../models/Activity';

export const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as string;

    const query: any = {};

    if (type && type !== 'All') {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      Activity.find(query)
        .populate('userId', 'name avatar email')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      Activity.countDocuments(query)
    ]);

    res.json({
      data: activities,
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
