import { Request, Response } from 'express';
import { User } from '../models/User';

// GET /api/watchlists
export const getWatchlist = async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);
  res.json({ watchlist: user?.watchlist || [] });
};

// POST /api/watchlists
export const updateWatchlist = async (req: Request, res: Response) => {
  const { watchlist } = req.body;
  if (!Array.isArray(watchlist)) {
    return res.status(400).json({ error: 'Invalid watchlist format' });
  }
  await User.findByIdAndUpdate(req.user._id, { watchlist });
  res.json({ success: true });
}; 