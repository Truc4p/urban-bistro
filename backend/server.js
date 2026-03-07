const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5175',
    methods: ['GET', 'POST']
  }
});

// Configure Socket.IO Redis adapter for horizontal scaling
const setupRedisAdapter = async () => {
  try {
    // Create separate Redis clients for Socket.IO pub/sub
    const pubClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      },
      password: process.env.REDIS_PASSWORD || undefined
    });
    
    const subClient = pubClient.duplicate();
    
    await Promise.all([pubClient.connect(), subClient.connect()]);
    
    io.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Socket.IO Redis adapter configured');
  } catch (err) {
    console.log('⚠️  Socket.IO running without Redis adapter:', err.message);
    // Server will continue to work without Redis adapter
  }
};

setupRedisAdapter();

// Middleware
app.use(helmet());
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5175';
console.log(`🔐 CORS enabled for origin: ${allowedOrigin}`);
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const { apiLimiter, authLimiter, bookingLimiter } = require('./middleware/rateLimiter');
app.use('/api/', apiLimiter); // Apply general rate limiting to all API routes

// Database connection
const db = require('./config/database');
const { syncDatabase } = require('./models');

db.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return syncDatabase();
  })
  .catch(err => console.error('❌ Database connection error:', err));

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/bookings', bookingLimiter, require('./routes/bookings'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/customers', require('./routes/customers'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-booking-updates', () => {
    socket.join('booking-updates');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO enabled for real-time updates`);
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error(`💡 Run: lsof -ti:${PORT} | xargs kill -9`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = { app, io };
