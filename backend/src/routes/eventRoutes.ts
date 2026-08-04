import express from 'express';
import { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  duplicateEvent, 
  rsvpEvent 
} from '../controllers/EventController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // Apply protect middleware to all event routes

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

router.post('/:id/duplicate', duplicateEvent);
router.post('/:id/rsvp', rsvpEvent);

export default router;
