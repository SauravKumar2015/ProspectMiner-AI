const express = require('express');
const router = express.Router();
const { getAnalytics } = require('./analytics.controller');
const { protect } = require('../../middleware/authMiddleware');

router.get('/summary', protect, getAnalytics);

module.exports = router;