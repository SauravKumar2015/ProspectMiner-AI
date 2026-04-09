const { getScrapeQueue } = require('../../queue/scrapeQueue');
const Job = require('../../models/Job');
const Lead = require('../../models/Lead');
const creditManager = require('../../utils/creditManager');

const startScrape = async (req, res, next) => {
  try {
    const { query, limit } = req.body;
    const userId = req.user._id;
    
    if (!query || !limit) {
      return res.status(400).json({
        success: false,
        message: 'Query and limit are required'
      });
    }
    
    if (limit < 1 || limit > 500) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 500'
      });
    }
    
    await creditManager.checkCredits(userId, limit);
    
    const job = await Job.create({
      userId,
      query,
      limit,
      status: 'pending',
      creditsSpent: limit
    });
    
    const queue = getScrapeQueue();
    await queue.add('scrape-job', {
      query,
      limit,
      userId,
      jobId: job._id
    });
    
    res.status(201).json({
      success: true,
      jobId: job._id,
      message: 'Scrape job queued successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;
    
    const job = await Job.findOne({ _id: jobId, userId });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    const queue = getScrapeQueue();
    const bullJob = await queue.getJob(jobId);
    
    let progress = 0;
    let state = job.status;
    
    if (bullJob) {
      const jobProgress = await bullJob.getProgress();
      if (typeof jobProgress === 'object') {
        progress = jobProgress.current || 0;
      } else if (typeof jobProgress === 'number') {
        progress = jobProgress;
      }
    }
    
    res.json({
      success: true,
      state,
      progress,
      total: job.limit,
      leadCount: job.leadCount,
      failReason: job.errorMessage,
      createdAt: job.createdAt,
      completedAt: job.completedAt
    });
  } catch (error) {
    next(error);
  }
};

const getJobLeads = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;
    
    const job = await Job.findOne({ _id: jobId, userId });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    const leads = await Lead.find({ jobId }).sort({ createdAt: 1 });
    
    res.json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { startScrape, getJobStatus, getJobLeads };