import express from 'express';
import { getWatchlist, updateWatchlist } from '../controllers/watchlistController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getWatchlist);
router.post('/', protect, updateWatchlist);

export default router; 