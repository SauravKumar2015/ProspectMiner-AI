const User = require('../../models/User');
const Job = require('../../models/Job');

const getBalance = async (req, res, next) => {
  try {
    res.json({
      success: true,
      credits: req.user.credits
    });
  } catch (error) {
    next(error);
  }
};

const getUsage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const jobs = await Job.find({ userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .select('query creditsSpent createdAt');
    
    const usage = jobs.map(job => ({
      jobId: job._id,
      query: job.query,
      creditsSpent: job.creditsSpent || 0,
      date: job.createdAt
    }));
    
    res.json({
      success: true,
      usage
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBalance, getUsage };