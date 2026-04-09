// In-memory mock Redis for development
class MockRedis {
  constructor() {
    this.store = new Map();
    this.queues = new Map();
    console.log('⚠️ Using in-memory Redis mock (no external Redis required)');
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async set(key, value, ttl) {
    this.store.set(key, value);
    if (ttl) {
      setTimeout(() => this.store.delete(key), ttl);
    }
    return 'OK';
  }

  async del(key) {
    return this.store.delete(key) ? 1 : 0;
  }

  async ping() {
    return 'PONG';
  }

  async quit() {
    this.store.clear();
    return 'OK';
  }

  on(event, callback) {
    // Mock event handler
    return this;
  }

  // For BullMQ compatibility
  async add(queue, job, data) {
    if (!this.queues.has(queue)) {
      this.queues.set(queue, []);
    }
    const jobId = Date.now().toString();
    this.queues.get(queue).push({ id: jobId, data, job });
    return { id: jobId };
  }

  async getQueue(queue) {
    return this.queues.get(queue) || [];
  }
}

let redisClient = null;

const getRedisClient = () => {
  if (!redisClient) {
    // Try to connect to real Redis if available, fallback to mock
    try {
      const Redis = require('ioredis');
      const realRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        lazyConnect: true,
        retryStrategy: () => null // Don't retry, just fail fast
      });
      
      // Test connection
      realRedis.ping().then(result => {
        if (result === 'PONG') {
          console.log('✅ Connected to real Redis server');
          redisClient = realRedis;
        }
      }).catch(() => {
        console.log('⚠️ Real Redis not available, using in-memory mock');
        redisClient = new MockRedis();
      });
    } catch (error) {
      console.log('⚠️ Redis module error, using in-memory mock');
      redisClient = new MockRedis();
    }
  }
  return redisClient;
};

module.exports = { getRedisClient };