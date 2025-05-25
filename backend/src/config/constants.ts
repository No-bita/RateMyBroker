export const COLLECTIONS = {
  USERS: 'RMB_users',
  STOCKS: 'RMB_stocks',
  BROKERS: 'RMB_brokers',
  CALLS: 'RMB_calls',
  TRANSACTIONS: 'RMB_transactions',
  WATCHLISTS: 'RMB_watchlists',
  PORTFOLIOS: 'RMB_portfolios',
  NOTIFICATIONS: 'RMB_notifications',
  SETTINGS: 'RMB_settings',
} as const;

// Database name
export const DB_NAME = 'fincheck';

// API Routes
export const API_ROUTES = {
  AUTH: '/api/auth',
  STOCKS: '/api/stocks',
  BROKERS: '/api/brokers',
  CALLS: '/api/calls',
  TRANSACTIONS: '/api/transactions',
  WATCHLISTS: '/api/watchlists',
  PORTFOLIOS: '/api/portfolios',
  NOTIFICATIONS: '/api/notifications',
  SETTINGS: '/api/settings',
} as const; 