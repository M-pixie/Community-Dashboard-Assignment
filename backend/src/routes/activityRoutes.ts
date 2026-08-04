import express from 'express';
import { getActivities } from '../controllers/activityController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protect, getActivities);

export default router;
