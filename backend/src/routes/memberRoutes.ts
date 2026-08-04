import express from 'express';
import { getMembers, getMemberById } from '../controllers/memberController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protect, getMembers);
router.get('/:id', protect, getMemberById);

export default router;
