import { Request, Response, NextFunction } from 'express';
import { Call } from '../models/Call';
import { Notification } from '../models/Notification';
import { AppError } from '../middleware/errorHandler';
import yahooFinance from 'yahoo-finance2';
import path from 'path';

export const createCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      stock,
      broker,
      action,
      target,
      stopLoss,
      entryDate,
      expiryDate,
      currentPrice,
      rationale,
      riskReward,
      tags,
      priceHistory,
      outcomeHistory,
      news,
      comments,
      type
    } = req.body;

    if (!stock || !broker || !action || !target || !stopLoss || !entryDate || !expiryDate || !currentPrice) {
      return next(new AppError('Missing required fields', 400));
    }

    // Handle file uploads
    let attachments: { name: string; url: string }[] = [];
    const files = (req as any).files;
    if (files && Array.isArray(files)) {
      attachments = files.map((file: any) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`
      }));
    }

    // Parse JSON fields if they are strings (from FormData)
    const parseJSON = (field: any, fallback: any) => {
      try {
        return typeof field === 'string' ? JSON.parse(field) : field || fallback;
      } catch {
        return fallback;
      }
    };

    const call = await Call.create({
      stock,
      broker,
      creator: req.user._id,
      action,
      status: 'PENDING VERIFICATION',
      target,
      stopLoss,
      entryDate,
      expiryDate,
      currentPrice,
      rationale,
      riskReward,
      tags: parseJSON(tags, []),
      priceHistory: parseJSON(priceHistory, []),
      outcomeHistory: parseJSON(outcomeHistory, []),
      news: parseJSON(news, []),
      comments: parseJSON(comments, []),
      attachments,
      type
    });

    res.status(201).json({ status: 'success', data: { call } });
  } catch (error) {
    next(error);
  }
};

export const getPendingCalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const calls = await Call.find({ status: 'PENDING VERIFICATION' }).populate('creator', 'name email');
    res.status(200).json({ status: 'success', data: { calls } });
  } catch (error) {
    next(error);
  }
};

export const approveCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const call = await Call.findByIdAndUpdate(req.params.id, { status: 'APPROVED' }, { new: true });
    if (!call) return next(new AppError('Call not found', 404));
    // Create notification for user
    await Notification.create({
      user: call.creator,
      type: 'CALL_STATUS',
      message: `Your call on ${call.stock} has been approved.`,
      callId: call._id,
    });
    res.status(200).json({ status: 'success', data: { call } });
  } catch (error) {
    next(error);
  }
};

export const rejectCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const call = await Call.findByIdAndUpdate(req.params.id, { status: 'REJECTED' }, { new: true });
    if (!call) return next(new AppError('Call not found', 404));
    // Create notification for user
    await Notification.create({
      user: call.creator,
      type: 'CALL_STATUS',
      message: `Your call on ${call.stock} has been rejected.`,
      callId: call._id,
    });
    res.status(200).json({ status: 'success', data: { call } });
  } catch (error) {
    next(error);
  }
};

export const getUserCalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const calls = await Call.find({ creator: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: { calls } });
  } catch (error) {
    next(error);
  }
};

export const getCallPerformance = async (req: Request, res: Response) => {
  const { callId } = req.params;
  const call = await Call.findById(callId);
  if (!call) return res.status(404).json({ error: 'Call not found' });

  const stockSymbol = call.stock; // Adjust if your field is different

  try {
    // Fetch daily historical prices for the last 6 months
    const result = await yahooFinance.historical(stockSymbol, {
      period1: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      period2: new Date(),
      interval: '1d',
    });
    // Format for chart: [{ date, close }]
    const priceHistory = result.map(item => ({
      date: item.date,
      close: item.close,
    }));
    res.json({ priceHistory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live data' });
  }
};

export const getCalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { broker } = req.query;
    const query: any = broker ? { broker } : {};
    // Only show non-pending calls
    query.status = { $ne: 'PENDING VERIFICATION' };
    const calls = await Call.find(query).populate('creator', 'name email');
    res.status(200).json({ status: 'success', data: { calls } });
  } catch (error) {
    next(error);
  }
};

// Compute broker stats from calls
export const getBrokerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brokerName = req.params.brokerName;
    if (!brokerName) return next(new AppError('Broker name is required', 400));

    // Fetch all calls for this broker
    const calls = await Call.find({ broker: brokerName });
    if (!calls.length) return res.status(404).json({ status: 'fail', message: 'No calls found for this broker' });

    // Compute stats
    const totalCalls = calls.length;
    const logoMap: Record<string, string> = {
      'Motilal Oswal': '/mo.png',
      'ICICI Securities': '/icici.png',
      'HDFC Securities': '/hdfc.png',
      'Angel One': '/angel.png',
      'IIFL Securities': '/iifl.png',
      'Kotak Securities': '/kotak.png',
      'SBI Securities': '/sbi.png',
    };
    const logo = logoMap[brokerName] || '';
    // Recent calls (last 10, sorted by entryDate desc)
    const recentCalls = calls
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
      .slice(0, 10)
      .map(call => ({
        stock: call.stock,
        action: call.action,
        status: call.status,
        date: call.entryDate,
        type: call.type,
      }));

    res.json({
      name: brokerName,
      logo,
      totalCalls,
      recentCalls,
    });
  } catch (error) {
    next(error);
  }
}; 