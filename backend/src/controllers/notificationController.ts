import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';

export const getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: { notifications } });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ status: 'fail', message: 'Notification not found' });
    res.status(200).json({ status: 'success', data: { notification } });
  } catch (error) {
    next(error);
  }
}; 