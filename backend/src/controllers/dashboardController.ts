import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Activity from '../models/Activity';

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalMembers = await User.countDocuments();
    const activeMembers = await User.countDocuments({ status: 'Active' });
    const inactiveMembers = await User.countDocuments({ status: 'Inactive' });
    
    const members = await User.find({}, 'engagementScore');
    const totalScore = members.reduce((sum, m) => sum + m.engagementScore, 0);
    const averageEngagementScore = totalMembers > 0 ? Math.round(totalScore / totalMembers) : 0;

    // Engagement Distribution
    const engagementDistribution = [
      { name: '0-20', value: await User.countDocuments({ engagementScore: { $lte: 20 } }) },
      { name: '21-40', value: await User.countDocuments({ engagementScore: { $gt: 20, $lte: 40 } }) },
      { name: '41-60', value: await User.countDocuments({ engagementScore: { $gt: 40, $lte: 60 } }) },
      { name: '61-80', value: await User.countDocuments({ engagementScore: { $gt: 60, $lte: 80 } }) },
      { name: '81-100', value: await User.countDocuments({ engagementScore: { $gt: 80 } }) },
    ];

    // Activity Over Time (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activities = await Activity.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const activityOverTime = activities.map(a => ({
      date: a._id,
      count: a.count
    }));

    res.json({
      totalMembers,
      activeMembers,
      inactiveMembers,
      averageEngagementScore,
      engagementDistribution,
      activityOverTime
    });
  } catch (error) {
    next(error);
  }
};
