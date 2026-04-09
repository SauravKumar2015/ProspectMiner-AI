// Simple in-memory queue for development (no Redis required)
class MemoryQueue {
  constructor() {
    this.jobs = new Map();
    this.processors = new Map();
    console.log('⚠️ Using in-memory queue (no Redis/BullMQ required)');
  }

  async add(name, data) {
    const jobId = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    const job = {
      id: jobId,
      name,
      data,
      progress: 0,
      status: 'waiting',
      createdAt: new Date()
    };
    this.jobs.set(jobId, job);
    
    // Process immediately if there's a processor
    setTimeout(() => this.processJob(jobId), 100);
    
    return { id: jobId };
  }

  async processJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return;
    
    const processor = this.processors.get('scrape-queue');
    if (processor) {
      try {
        job.status = 'active';
        const result = await processor(job);
        job.status = 'completed';
        job.returnvalue = result;
        console.log(`✅ Job ${jobId} completed`);
      } catch (error) {
        job.status = 'failed';
        job.failedReason = error.message;
        console.error(`❌ Job ${jobId} failed:`, error.message);
      }
    }
  }

  async getJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return null;
    
    return {
      id: job.id,
      data: job.data,
      status: job.status,
      progress: job.progress,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
      getProgress: async () => job.progress,
      updateProgress: async (progress) => {
        job.progress = progress;
        console.log(`📊 Job ${jobId} progress:`, progress);
      }
    };
  }

  process(processor) {
    this.processors.set('scrape-queue', processor);
  }
}

let scrapeQueue = null;

const getScrapeQueue = () => {
  if (!scrapeQueue) {
    scrapeQueue = new MemoryQueue();
    console.log('📋 In-memory scrape queue initialized');
  }
  return scrapeQueue;
};

module.exports = { getScrapeQueue };