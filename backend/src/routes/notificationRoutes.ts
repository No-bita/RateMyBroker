import express from 'express';
import { getUserNotifications, markNotificationRead } from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.post('/:id/read', protect, markNotificationRead);

export default router; 