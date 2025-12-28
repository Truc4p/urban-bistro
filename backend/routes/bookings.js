const express = require('express');
const router = express.Router();
const { Booking, Table, Customer } = require('../models');
const { Op } = require('sequelize');
const { sendBookingConfirmation } = require('../config/email');
const redisClient = require('../config/redis');

// Get available time slots for a date
router.get('/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { guests } = req.query;

    // Check cache first (only if Redis is connected)
    const cacheKey = `availability:${date}:${guests || 'all'}`;
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

    const tables = await Table.findAll({
      where: {
        isActive: true,
        ...(guests && { capacity: { [Op.gte]: parseInt(guests) } })
      },
      include: [{
        model: Booking,
        as: 'bookings',
        where: { bookingDate: date, status: { [Op.ne]: 'cancelled' } },
        required: false
      }]
    });

    const availability = tables.map(table => ({
      tableId: table.id,
      tableName: table.name,
      capacity: table.capacity,
      location: table.location,
      bookedSlots: table.bookings.map(b => ({
        startTime: b.startTime,
        endTime: b.endTime
      }))
    }));

    // Cache for 5 minutes (only if Redis is connected)
    if (redisClient.isReady) {
      try {
        await redisClient.setEx(cacheKey, 300, JSON.stringify(availability));
      } catch (err) {
        // Ignore cache errors
      }
    }

    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { customerId, tableId, bookingDate, startTime, endTime, guests, specialRequests } = req.body;

    // Check for conflicts
    const conflict = await Booking.findOne({
      where: {
        tableId,
        bookingDate,
        status: { [Op.ne]: 'cancelled' },
        [Op.or]: [
          { startTime: { [Op.lt]: endTime }, endTime: { [Op.gt]: startTime } }
        ]
      }
    });

    if (conflict) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    const booking = await Booking.create({
      customerId, tableId, bookingDate, startTime, endTime, guests, specialRequests, status: 'confirmed'
    });

    // Fetch full booking details
    const fullBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Table, as: 'table' }
      ]
    });

    // Send confirmation email
    try {
      await sendBookingConfirmation({
        id: booking.id,
        customerName: `${fullBooking.customer.firstName} ${fullBooking.customer.lastName}`,
        email: fullBooking.customer.email,
        date: bookingDate,
        time: startTime,
        guests,
        tableName: fullBooking.table.name
      });
      await booking.update({ confirmationSent: true });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      // Continue without email - booking is still valid
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to('booking-updates').emit('new-booking', { date: bookingDate, tableId });

    // Invalidate cache (only if Redis is connected)
    if (redisClient.isReady) {
      try {
        await redisClient.del(`availability:${bookingDate}:all`);
      } catch (err) {
        // Ignore cache errors
      }
    }

    res.status(201).json(fullBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer bookings
router.get('/customer/:customerId', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { customerId: req.params.customerId },
      include: [{ model: Table, as: 'table' }],
      order: [['bookingDate', 'DESC'], ['startTime', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update({ status: 'cancelled' });
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to('booking-updates').emit('booking-cancelled', { 
      date: booking.bookingDate, 
      tableId: booking.tableId 
    });

    // Invalidate cache (only if Redis is connected)
    if (redisClient.isReady) {
      try {
        await redisClient.del(`availability:${booking.bookingDate}:all`);
      } catch (err) {
        // Ignore cache errors
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
