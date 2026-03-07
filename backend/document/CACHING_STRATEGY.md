# Redis Caching Strategy

This document explains how caching works in the restaurant booking system and answers common questions about cache freshness.

## 🤔 Your Question: What if data changes during the cache period?

**Short Answer:** Changes are **immediately reflected** because we invalidate the cache on every write operation!

## 📖 How It Works

### Two-Pronged Approach

1. **TTL (Time To Live)** - Maximum time data stays cached
2. **Cache Invalidation** - Immediate deletion when data changes

### Example Flow

```
TIME    ACTION                          CACHE STATE
-----   ------------------------------  ---------------------------
10:00   User A checks availability      ✅ DB query → Cache stored (TTL: 5 min)
10:01   User B checks availability      ⚡ Served from cache (FAST!)
10:02   User C creates booking          🗑️  Cache DELETED immediately
10:02   User D checks availability      ✅ Fresh DB query (cache miss)
10:03   User E checks availability      ⚡ Served from cache (rebuilt at 10:02)
10:05   (Original TTL expires)          ⏰ Would expire, but already refreshed
```

## 🎯 Cache Strategy by Endpoint

### 1. Booking Availability
**Cache Key:** `availability:{date}:{guests}`
- **TTL:** 5 minutes
- **Invalidated When:** 
  - New booking created
  - Booking cancelled
  - Booking updated
- **Pattern:** Deletes ALL guest variations for that date

Example:
```javascript
// Keys that get cached:
availability:2024-03-07:all     // All tables
availability:2024-03-07:2       // 2+ capacity
availability:2024-03-07:4       // 4+ capacity

// When a booking is created on 2024-03-07:
// ALL above keys are deleted immediately ✅
```

### 2. Menu Items
**Cache Key:** `menu:{category}` and `menu:item:{id}`
- **TTL:** 10 minutes
- **Invalidated When:**
  - Menu item created/updated/deleted
  - Availability toggled
- **Why longer TTL?** Menu items rarely change compared to bookings

### 3. Tables
**Cache Key:** `tables:all`
- **TTL:** 15 minutes
- **Invalidated When:**
  - New table created
  - Table updated
  - Table deleted/deactivated
- **Why longest TTL?** Tables almost never change

## ⚡ Cache Invalidation Strategies

### Current Implementation: Pattern Deletion

```javascript
// When booking created on 2024-03-07:
const keys = await redisClient.keys('availability:2024-03-07:*');
await redisClient.del(keys);  // Deletes ALL matches
```

**Pros:**
- ✅ Simple to implement
- ✅ Guarantees fresh data
- ✅ No stale cache possible

**Cons:**
- ⚠️ `KEYS` command can be slow with millions of keys
- ⚠️ Blocks Redis briefly (not recommended for huge datasets)

### Alternative: Scan Pattern (For Scale)

For 10,000+ simultaneous cache keys, use SCAN instead:

```javascript
// utils/cacheHelper.js (already supports pattern deletion)
async function deleteCachePattern(pattern) {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}

// For massive scale, replace with:
async function deleteCachePatternScan(pattern) {
  let cursor = '0';
  do {
    const result = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100
    });
    cursor = result.cursor;
    if (result.keys.length > 0) {
      await redisClient.del(result.keys);
    }
  } while (cursor !== '0');
}
```

## 📊 When NOT to Rely Only on TTL

### Without Invalidation (BAD) ❌
```javascript
// Someone checks availability at 10:00
GET /api/bookings/availability/2024-03-07
// Cached until 10:05 (5-min TTL)

// Someone books at 10:02
POST /api/bookings { date: '2024-03-07', ... }
// ⚠️ WITHOUT invalidation, cache still shows old availability

// Someone checks at 10:03
GET /api/bookings/availability/2024-03-07
// ❌ Returns stale data (says slot is free when it's not!)
```

### With Invalidation (GOOD) ✅
```javascript
// Someone checks availability at 10:00
GET /api/bookings/availability/2024-03-07
// Cached until 10:05

// Someone books at 10:02
POST /api/bookings { date: '2024-03-07', ... }
// ✅ Cache DELETED immediately

// Someone checks at 10:03
GET /api/bookings/availability/2024-03-07
// ✅ Fresh query from DB, accurate data
```

## 🛡️ Stale Data Protection

### Built-in Safeguards

1. **Write-Through Pattern:** Delete cache on every mutation
2. **Conservative TTLs:** Short expiry for frequently changing data
3. **Graceful Fallback:** If Redis fails, queries go directly to DB

### Cache Hierarchy

```
Freshness Priority (most to least):

1. Real-time booking conflicts check (always DB)
2. Booking availability (5 min cache, instant invalidation)
3. Menu items (10 min cache)
4. Tables (15 min cache)
```

## 🔍 Monitoring Cache Effectiveness

### Check Cache Hit Rate

```bash
# In Redis CLI
redis-cli INFO stats | grep hits
# keyspace_hits:8432
# keyspace_misses:1234
# Hit rate = 87.2% (very good!)
```

### View Cached Keys

```bash
# See all cache keys
redis-cli KEYS *

# See specific patterns
redis-cli KEYS "availability:*"
redis-cli KEYS "menu:*"

# Check TTL of a key
redis-cli TTL "menu:all"
# Returns: 587 (seconds remaining)
```

### Manual Cache Management

```javascript
// In your app or via API endpoint (admin only!)
const { clearAllCache } = require('./utils/cacheHelper');

// Nuclear option: clear everything
await clearAllCache();
```

## 🎨 Visual: Cache Lifecycle

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌──────────────┐      YES      ┌──────────────┐
│ In Cache &   │───────────────▶│ Return from  │
│ Not Expired? │                │ Redis Cache  │
└──────┬───────┘                └──────────────┘
       │ NO
       ▼
┌──────────────┐                ┌──────────────┐
│ Query from   │─────────────┬─▶│ Return to    │
│ Database     │             │  │ Client       │
└──────────────┘             │  └──────────────┘
       │                     │
       ▼                     │
┌──────────────┐             │
│ Store in     │─────────────┘
│ Redis + TTL  │
└──────────────┘

       When Data Changes:
       
┌──────────────┐
│ POST/PUT/    │
│ DELETE       │
└──────┬───────┘
       │
       ▼
┌──────────────┐                ┌──────────────┐
│ Update       │───────────────▶│ Invalidate   │
│ Database     │                │ Cache Keys   │
└──────────────┘                └──────────────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │ Next read    │
                               │ fetches      │
                               │ fresh data   │
                               └──────────────┘
```

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Forgetting to Invalidate on Updates
**Problem:** Updating a booking but not deleting the cache
```javascript
// BAD ❌
await booking.update({ status: 'confirmed' });
// Cache still has old status!
```

**Solution:** Always invalidate after mutations
```javascript
// GOOD ✅
await booking.update({ status: 'confirmed' });
await invalidateAvailabilityCache(booking.bookingDate);
```

### Pitfall 2: Partial Invalidation
**Problem:** Only deleting one cache key when multiple need updating
```javascript
// BAD ❌
await redisClient.del('availability:2024-03-07:all');
// But 'availability:2024-03-07:2' and 'availability:2024-03-07:4' still cached!
```

**Solution:** Use pattern deletion
```javascript
// GOOD ✅
const keys = await redisClient.keys('availability:2024-03-07:*');
await redisClient.del(keys);  // Deletes ALL variations
```

### Pitfall 3: Over-Caching
**Problem:** Caching user-specific data with shared keys
```javascript
// BAD ❌
cacheKey = 'user-bookings';  // Same key for all users!
```

**Solution:** Include user ID in cache key
```javascript
// GOOD ✅
cacheKey = `user-bookings:${userId}`;
```

## 📈 Scaling Considerations

### Current Setup (Good for 100-500 concurrent users)
- Pattern deletion with `KEYS` command
- Simple cache invalidation
- Single Redis instance

### High Scale (1000+ concurrent users)
Consider:
1. **Redis Cluster:** Distribute cache across multiple nodes
2. **SCAN instead of KEYS:** Non-blocking key iteration
3. **Cache Versioning:** Add version numbers to keys
4. **Pub/Sub Invalidation:** Broadcast cache clears across servers
5. **Cache Warming:** Pre-populate cache for popular dates

### Enterprise Scale (10,000+ concurrent users)
Consider:
1. **Multi-Layer Cache:** Redis + CDN + In-Memory
2. **Separate Cache Clusters:** Read vs Write
3. **Cache Analytics:** Track hit rates per endpoint
4. **Intelligent TTLs:** Shorter for peak hours, longer for off-peak

## 🎓 Key Takeaways

1. **TTL is a safety net, not the primary freshness mechanism**
2. **Always invalidate cache on write operations**
3. **Use pattern deletion for related cache keys**
4. **Monitor cache hit rates to optimize TTLs**
5. **The app works fine without Redis (graceful degradation)**

## 💡 Quick Reference

| Data Type    | Cache Key Pattern           | TTL    | Invalidate On            |
|--------------|----------------------------|--------|--------------------------|
| Availability | `availability:{date}:*`    | 5 min  | Booking create/cancel    |
| Menu List    | `menu:{category}`          | 10 min | Menu item change         |
| Menu Item    | `menu:item:{id}`           | 10 min | Item update              |
| Tables       | `tables:all`               | 15 min | Table create/update      |

---

**Need to invalidate cache manually?**
```bash
# Via Redis CLI
redis-cli KEYS "availability:2024-03-07:*" | xargs redis-cli DEL

# Via helper function (in code)
const { invalidateAvailabilityCache } = require('./utils/cacheHelper');
await invalidateAvailabilityCache('2024-03-07');
```
