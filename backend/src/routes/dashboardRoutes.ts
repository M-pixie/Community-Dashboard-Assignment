import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protect, getDashboardStats);

export default router;
