const express = require('express');
const router = express.Router();
const { Table } = require('../models');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.findAll({ where: { isActive: true } });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create table (admin only - add auth middleware)
router.post('/', async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
