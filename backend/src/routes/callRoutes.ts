import express from 'express';
import { createCall, getPendingCalls, approveCall, rejectCall, getUserCalls, getCallPerformance, getCalls } from '../controllers/callController';
import { protect } from '../middleware/auth';
import multer from 'multer';
// import { restrictTo } from '../middleware/auth'; // Uncomment if you have role-based middleware

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, upload.array('attachments'), createCall);
router.get('/my', protect, getUserCalls);
// Admin routes (add restrictTo('admin') if available)
router.get('/pending', protect, /*restrictTo('admin'),*/ getPendingCalls);
router.post('/:id/approve', protect, /*restrictTo('admin'),*/ approveCall);
router.post('/:id/reject', protect, /*restrictTo('admin'),*/ rejectCall);
router.get('/:callId/performance', getCallPerformance);
router.get('/', getCalls);

export default router; 