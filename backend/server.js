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
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:5175',
        'http://localhost:5173'
      ].filter(Boolean);
      
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith('.vercel.app');
      
      callback(null, isAllowed);
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Configure Socket.IO Redis adapter for horizontal scaling
const setupRedisAdapter = async () => {
  try {
    // Support both REDIS_URL connection string and individual variables
    const redisConfig = process.env.REDIS_URL
      ? { url: process.env.REDIS_URL }
      : {
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
          },
          password: process.env.REDIS_PASSWORD || undefined
        };
    
    // Create separate Redis clients for Socket.IO pub/sub
    const pubClient = createClient(redisConfig);
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
// Trust proxy - required for rate limiting behind Render/Railway proxies
app.set('trust proxy', 1);

app.use(helmet());

// CORS configuration - allow multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5175',
  'http://localhost:5173'
].filter(Boolean);

// Allow all Vercel preview deployments
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origins or Vercel preview pattern
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

console.log(`🔐 CORS enabled for: ${allowedOrigins.join(', ')} + *.vercel.app`);
app.use(cors(corsOptions));
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
app.use('/api/admin', require('./routes/admin')); // Temporary admin routes

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
