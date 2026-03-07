const redis = require('redis');
require('dotenv').config();

// Support both REDIS_URL connection string and individual variables
const redisConfig = process.env.REDIS_URL
  ? {
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('⚠️  Redis unavailable - running without cache');
            return false;
          }
          return Math.min(retries * 100, 3000);
        }
      }
    }
  : {
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('⚠️  Redis unavailable - running without cache');
            return false;
          }
          return Math.min(retries * 100, 3000);
        }
      },
      password: process.env.REDIS_PASSWORD || undefined
    };

const redisClient = redis.createClient(redisConfig);

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
