const express = require('express');
const router = express.Router();
const { getHistory, deleteJob } = require('./history.controller');
const { protect } = require('../../middleware/authMiddleware');

router.get('/', protect, getHistory);
router.delete('/:jobId', protect, deleteJob);

module.exports = router;