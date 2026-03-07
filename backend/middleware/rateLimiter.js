const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../config/redis');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Use Redis store if available, otherwise use default memory store
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:',
  }) : undefined,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

// Stricter rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:',
  }) : undefined
});

// Booking rate limiter (less strict)
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 booking requests per windowMs
  message: 'Too many booking requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient.isReady ? new RedisStore({
    client: redisClient,
    prefix: 'rl:booking:',
  }) : undefined
});

module.exports = {
  apiLimiter,
  authLimiter,
  bookingLimiter
};
