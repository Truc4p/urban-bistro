const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (retries) => {
      // Stop retrying after 3 attempts
      if (retries > 3) {
        console.log('⚠️  Redis unavailable - running without cache');
        return false; // Stop retrying
      }
      return Math.min(retries * 100, 3000);
    }
  },
  password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED') {
    console.error('Redis Client Error:', err.message);
  }
});

redisClient.on('connect', () => console.log('✅ Redis connected'));

// Connect with error handling
redisClient.connect().catch((err) => {
  console.log('⚠️  Redis not available - server will run without caching');
});

module.exports = redisClient;
