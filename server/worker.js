require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Job = require('./src/models/Job');
const Lead = require('./src/models/Lead');
const mapsScraper = require('./src/scraper/mapsScraper');
const enrichLead = require('./src/modules/enrichment/enrichLead');
const creditManager = require('./src/utils/creditManager');

connectDB();

console.log('👷 Worker started (in-memory mode, no Redis required)');

// Simple in-memory queue processing
async function processJob(job) {
  const { query, limit, userId, jobId } = job.data;
  
  console.log(`🔄 Processing job ${jobId}: ${query} (limit: ${limit})`);
  
  try {
    await Job.findByIdAndUpdate(jobId, { status: 'processing' });
    
    // Update progress function
    const updateProgress = async (progress) => {
      console.log(`📊 Job ${jobId} progress:`, progress);
    };
    
    const scrapedLeads = await mapsScraper.scrapeGoogleMaps(query, limit, async (progress) => {
      await updateProgress({
        step: 'scraping',
        current: progress.current,
        total: progress.total,
        message: `Scraped ${progress.current}/${progress.total} businesses`
      });
    });
    
    if (scrapedLeads.length === 0) {
      throw new Error('No leads found from Google Maps');
    }
    
    for (let i = 0; i < scrapedLeads.length; i++) {
      const lead = scrapedLeads[i];
      
      await updateProgress({
        step: 'enriching',
        current: i + 1,
        total: scrapedLeads.length,
        message: `Enriching lead ${i + 1}/${scrapedLeads.length}: ${lead.name}`
      });
      
      const enriched = await enrichLead(lead, query);
      
      await Lead.create({
        jobId,
        name: lead.name,
        address: lead.address,
        phone: lead.phone,
        website: lead.website,
        rating: lead.rating,
        score: enriched.score || 'Medium',
        services: enriched.services || [],
        emailPattern: enriched.emailPattern || '',
        ownerName: enriched.ownerName || '',
        createdAt: new Date()
      });
    }
    
    await Job.findByIdAndUpdate(jobId, {
      status: 'completed',
      leadCount: scrapedLeads.length,
      completedAt: new Date()
    });
    
    await creditManager.deductCredits(userId, limit);
    
    console.log(`✅ Job ${jobId} completed successfully`);
    
  } catch (error) {
    console.error(`❌ Job ${jobId} failed:`, error);
    
    await Job.findByIdAndUpdate(jobId, {
      status: 'failed',
      errorMessage: error.message,
      completedAt: new Date()
    });
  }
}

// Check for pending jobs every 5 seconds
async function checkPendingJobs() {
  try {
    const pendingJob = await Job.findOne({ 
      status: 'pending',
      $or: [
        { createdAt: { $exists: true } }
      ]
    }).sort({ createdAt: 1 });
    
    if (pendingJob) {
      console.log(`📋 Found pending job: ${pendingJob._id}`);
      await processJob({
        data: {
          query: pendingJob.query,
          limit: pendingJob.limit,
          userId: pendingJob.userId,
          jobId: pendingJob._id
        }
      });
    }
  } catch (error) {
    console.error('Error checking pending jobs:', error);
  }
  
  setTimeout(checkPendingJobs, 5000);
}

// Start checking for jobs
checkPendingJobs();

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing...');
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing...');
  await mongoose.disconnect();
  process.exit(0);
});