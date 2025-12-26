const express = require('express');
const router = express.Router();
const { MenuItem } = require('../models');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = { isAvailable: true };
    if (category) where.category = category;
    
    const items = await MenuItem.findAll({ where });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
