const Job = require('../../models/Job');
const Lead = require('../../models/Lead');

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const jobs = await Job.find({ userId, status: 'completed' });
    const jobIds = jobs.map(job => job._id);
    
    const totalLeads = await Lead.countDocuments({ jobId: { $in: jobIds } });
    const totalJobs = jobs.length;
    const creditsUsed = jobs.reduce((sum, job) => sum + (job.creditsSpent || 0), 0);
    
    const scoreDistribution = await Lead.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$score', count: { $sum: 1 } } }
    ]);
    
    const distribution = { High: 0, Medium: 0, Low: 0 };
    scoreDistribution.forEach(item => {
      if (item._id in distribution) distribution[item._id] = item.count;
    });
    
    const leadsOverTime = await Lead.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    
    const topQueries = await Job.aggregate([
      { $match: { userId, status: 'completed' } },
      {
        $lookup: {
          from: 'leads',
          localField: '_id',
          foreignField: 'jobId',
          as: 'leads'
        }
      },
      {
        $project: {
          query: 1,
          totalLeads: { $size: '$leads' },
          highLeads: {
            $size: {
              $filter: {
                input: '$leads',
                as: 'lead',
                cond: { $eq: ['$$lead.score', 'High'] }
              }
            }
          }
        }
      },
      {
        $project: {
          query: 1,
          totalLeads: 1,
          highPercent: {
            $multiply: [
              { $divide: ['$highLeads', { $max: ['$totalLeads', 1] }] },
              100
            ]
          }
        }
      },
      { $sort: { highPercent: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalLeads,
        totalJobs,
        creditsUsed,
        scoreDistribution: distribution,
        leadsOverTime: leadsOverTime.map(item => ({
          date: item._id,
          count: item.count
        })),
        topQueries: topQueries.map(item => ({
          query: item.query,
          totalLeads: item.totalLeads,
          highPercent: Math.round(item.highPercent)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };