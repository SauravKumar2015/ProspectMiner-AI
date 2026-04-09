export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESULTS: '/results/:jobId',
  HISTORY: '/history',
  ANALYTICS: '/analytics'
}

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me'
  },
  SCRAPE: {
    START: '/api/scrape',
    STATUS: '/api/scrape/status',
    LEADS: '/api/scrape/leads'
  },
  HISTORY: '/api/history',
  ANALYTICS: '/api/analytics/summary',
  CREDITS: {
    BALANCE: '/api/credits/balance',
    USAGE: '/api/credits/usage'
  }
}