const express = require('express');
const router = express.Router();
const { Table } = require('../models');
const redisClient = require('../config/redis');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'tables:all';
    
    // Check cache first (only if Redis is connected)
    if (redisClient.isReady) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (err) {
        // Ignore cache errors, continue without cache
      }
    }
    
    const tables = await Table.findAll({ where: { isActive: true } });
    
    // Cache for 15 minutes (tables don't change often)
    if (redisClient.isReady) {
      try {
        await redisClient.setEx(cacheKey, 900, JSON.stringify(tables));
      } catch (err) {
        // Ignore cache errors
      }
    }
    
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create table (admin only - add auth middleware)
router.post('/', async (req, res) => {
  try {
    const table = await Table.create(req.body);
    
    // Invalidate cache when creating new table
    if (redisClient.isReady) {
      try {
        await redisClient.del('tables:all');
      } catch (err) {
        // Ignore cache errors
      }
    }
    
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
