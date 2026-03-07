## Cache Timing Example

### Scenario: Multiple bookings within cache period

```
Time    Action                          Cache State                    What User Sees
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10:00   👤 User A checks availability   [MISS] → Query DB              ✅ 5 tables available
                                        Store in cache (TTL: 5min)     
                                        Expires at: 10:05

10:01   👤 User B checks availability   [HIT] → Return from cache      ✅ 5 tables available
                                        Cache valid until: 10:05       (super fast!)

10:02   📝 User C creates booking       Update DB                      ✅ Booking confirmed
        (books Table 1)                 💥 DELETE all cache keys!      
                                        availability:2024-03-07:*

10:02   👤 User D checks availability   [MISS] → Query fresh DB        ✅ 4 tables available
        (30 seconds after booking)      Store in cache (TTL: 5min)     (Table 1 gone)
                                        Expires at: 10:07              ✅ ACCURATE!

10:03   📝 User E creates booking       Update DB                      ✅ Booking confirmed
        (books Table 2)                 💥 DELETE all cache keys!

10:03   👤 User F checks availability   [MISS] → Query fresh DB        ✅ 3 tables available
                                        Store in cache (TTL: 5min)     (Tables 1,2 gone)
                                        Expires at: 10:08              ✅ ACCURATE!

10:04   👤 User G checks availability   [HIT] → Return from cache      ✅ 3 tables available
                                        Cache valid until: 10:08       (fast & accurate!)

10:05   (Original cache would expire)   Cache already refreshed        N/A
        if no bookings happened         at 10:03, still valid

10:08   (Cache expires naturally)       Next request will query DB     Next user gets fresh
                                                                       data automatically
```

## Key Points

1. **WITHOUT cache invalidation:**
   - User D at 10:02 would see: ❌ 5 tables (WRONG! Table 1 is booked)
   - User F at 10:03 would see: ❌ 5 tables (WRONG! Tables 1,2 are booked)
   - Stale data until 10:05 when TTL expires

2. **WITH cache invalidation (our implementation):**
   - User D at 10:02 sees: ✅ 4 tables (CORRECT!)
   - User F at 10:03 sees: ✅ 3 tables (CORRECT!)
   - Always accurate, cache just speeds up reads

3. **Best of both worlds:**
   - ⚡ Fast reads from cache (Users B, G)
   - ✅ Always accurate (cache deleted on writes)
   - 🛡️ TTL as safety net (in case invalidation fails)

## What if 10 bookings happen in 5 minutes?

```
Time    Action                     Cache Hit/Miss    Performance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10:00   Check availability         MISS (DB query)   ~50ms
10:00   Check availability         HIT (cache)       ~2ms ⚡
10:01   Create booking #1          → Invalidate      ~30ms
10:01   Check availability         MISS (DB query)   ~50ms
10:01   Check availability         HIT (cache)       ~2ms ⚡
10:02   Create booking #2          → Invalidate      ~30ms
10:02   Check availability         MISS (DB query)   ~50ms
10:02   Check availability         HIT (cache)       ~2ms ⚡
10:03   Create booking #3          → Invalidate      ~30ms
10:03   Check availability         MISS (DB query)   ~50ms
... (7 more bookings with same pattern)

Result: Still 95%+ faster than querying DB every time!
Even with frequent writes, cache provides huge benefit.
```

## The Magic Formula

```
Cache Effectiveness = (Read Frequency) / ((Write Frequency) + 1)

Examples:
- 100 reads, 1 write  → 99% cache hits  ⚡⚡⚡ (excellent)
- 100 reads, 10 writes → 90% cache hits  ⚡⚡  (very good)
- 10 reads, 10 writes  → 50% cache hits  ⚡   (still helpful)
- 1 read, 10 writes    → 9% cache hits   ❌   (cache not useful)

Restaurant booking apps: Typically 80-95% reads (browsing menu, checking 
availability) vs 5-20% writes (creating bookings). Perfect for caching!
```
