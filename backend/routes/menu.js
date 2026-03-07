const express = require('express');
const router = express.Router();
const { MenuItem } = require('../models');
const redisClient = require('../config/redis');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const cacheKey = `menu:${category || 'all'}`;
    
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
    
    const where = { isAvailable: true };
    if (category) where.category = category;
    
    const items = await MenuItem.findAll({ where });
    
    // Cache for 10 minutes (menu items don't change often)
    if (redisClient.isReady) {
      try {
        await redisClient.setEx(cacheKey, 600, JSON.stringify(items));
      } catch (err) {
        // Ignore cache errors
      }
    }
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const cacheKey = `menu:item:${req.params.id}`;
    
    // Check cache first
    if (redisClient.isReady) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (err) {
        // Ignore cache errors
      }
    }
    
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    // Cache for 10 minutes
    if (redisClient.isReady) {
      try {
        await redisClient.setEx(cacheKey, 600, JSON.stringify(item));
      } catch (err) {
        // Ignore cache errors
      }
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
