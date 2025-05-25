import cron from 'node-cron';
import { Call } from '../models/Call';
import yahooFinance from 'yahoo-finance2';

// Runs once every 24 hours at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  console.log('[PriceTrackerJob] Running daily price check for approved calls...');
  const approvedCalls = await Call.find({ status: 'APPROVED' });
  for (const call of approvedCalls) {
    try {
      // Fetch daily quote for the stock
      const quote = await yahooFinance.quote(call.stock);
      const cmp = quote.regularMarketPrice;
      const high = quote.regularMarketDayHigh;
      const low = quote.regularMarketDayLow;

      // Compare high with target and stop loss
      let newStatus = call.status;
      if (high >= call.target) {
        newStatus = 'TARGET HIT';
      } else if (low <= call.stopLoss) {
        newStatus = 'STOP LOSS HIT';
      }

      call.currentPrice = cmp;
      call.status = newStatus;
      await call.save();
    } catch (err) {
      console.error(`[PriceTrackerJob] Error fetching price for ${call.stock}:`, err);
    }
  }
}); 