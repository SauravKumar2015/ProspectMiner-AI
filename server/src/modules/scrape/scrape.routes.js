const express = require('express');
const router = express.Router();
const { startScrape, getJobStatus, getJobLeads } = require('./scrape.controller');
const { protect } = require('../../middleware/authMiddleware');
const { scrapeLimiter } = require('../../middleware/rateLimiter');

router.post('/', protect, scrapeLimiter, startScrape);
router.get('/status/:jobId', protect, getJobStatus);
router.get('/leads/:jobId', protect, getJobLeads);

module.exports = router;