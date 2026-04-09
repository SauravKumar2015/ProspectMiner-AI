const Job = require('../../models/Job');
const Lead = require('../../models/Lead');

const getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const jobs = await Job.find({ userId })
      .sort({ createdAt: -1 })
      .select('query limit status leadCount creditsSpent createdAt completedAt errorMessage');
    
    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
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
    
    await Lead.deleteMany({ jobId });
    await Job.deleteOne({ _id: jobId });
    
    res.json({
      success: true,
      message: 'Job and associated leads deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, deleteJob };