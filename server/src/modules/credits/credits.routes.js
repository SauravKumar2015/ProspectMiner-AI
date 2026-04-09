const express = require('express');
const router = express.Router();
const { getBalance, getUsage } = require('./credits.controller');
const { protect } = require('../../middleware/authMiddleware');

router.get('/balance', protect, getBalance);
router.get('/usage', protect, getUsage);

module.exports = router;