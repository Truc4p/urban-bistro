const redisClient = require('../config/redis');

/**
 * Cache Helper Utilities
 * 
 * Provides functions for managing Redis cache with automatic error handling.
 * All cache operations are optional - the app works fine without Redis.
 */

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Parsed data or null if not found
 */
async function getCache(key) {
  if (!redisClient.isReady) return null;
  
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error(`Cache get error for key ${key}:`, err.message);
    return null;
  }
}

/**
 * Set data in cache with TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache (will be JSON stringified)
 * @param {number} ttl - Time to live in seconds
 */
async function setCache(key, data, ttl = 300) {
  if (!redisClient.isReady) return;
  
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.error(`Cache set error for key ${key}:`, err.message);
  }
}

/**
 * Delete specific cache key
 * @param {string} key - Cache key to delete
 */
async function deleteCache(key) {
  if (!redisClient.isReady) return;
  
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`Cache delete error for key ${key}:`, err.message);
  }
}

/**
 * Delete all cache keys matching a pattern
 * ⚠️ WARNING: Use KEYS command sparingly in production with large datasets
 * For high-traffic apps, consider using SCAN or maintaining a key index
 * 
 * @param {string} pattern - Pattern to match (e.g., 'availability:2024-03-07:*')
 */
async function deleteCachePattern(pattern) {
  if (!redisClient.isReady) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🗑️  Invalidated ${keys.length} cache keys matching: ${pattern}`);
    }
  } catch (err) {
    console.error(`Cache pattern delete error for pattern ${pattern}:`, err.message);
  }
}

/**
 * Invalidate all availability caches for a specific date
 * This clears all guest-count variations for that date
 * 
 * @param {string} bookingDate - Date in YYYY-MM-DD format
 */
async function invalidateAvailabilityCache(bookingDate) {
  await deleteCachePattern(`availability:${bookingDate}:*`);
}

/**
 * Invalidate all menu caches (all categories and items)
 */
async function invalidateMenuCache() {
  await deleteCachePattern('menu:*');
}

/**
 * Invalidate specific menu item cache
 * @param {number|string} itemId - Menu item ID
 */
async function invalidateMenuItemCache(itemId) {
  await deleteCache(`menu:item:${itemId}`);
  // Also invalidate category caches since they include this item
  await deleteCachePattern('menu:*');
}

/**
 * Invalidate tables cache
 */
async function invalidateTablesCache() {
  await deleteCache('tables:all');
}

/**
 * Clear all caches (nuclear option - use with caution)
 */
async function clearAllCache() {
  if (!redisClient.isReady) return;
  
  try {
    await redisClient.flushDb();
    console.log('🧹 All cache cleared');
  } catch (err) {
    console.error('Cache flush error:', err.message);
  }
}

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  invalidateAvailabilityCache,
  invalidateMenuCache,
  invalidateMenuItemCache,
  invalidateTablesCache,
  clearAllCache
};
