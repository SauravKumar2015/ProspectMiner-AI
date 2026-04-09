const rateLimit = require('express-rate-limit');

const scrapeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many scrape requests, please try again later'
  },
  keyGenerator: (req) => req.user?.id || req.ip
});

module.exports = { scrapeLimiter };