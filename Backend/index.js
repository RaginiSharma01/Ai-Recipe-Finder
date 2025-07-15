require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Initialize Express app
const app = express();

// 1. Database Connection
connectDb();
console.log("MONGODB_URI:", process.env.MONGO_URI?.substring(0, 20) + '...');
console.log("HUGGING_FACE_API_KEY:", process.env.HUGGING_FACE_API_KEY ? "***loaded***" : "missing");

// 2. Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Multiple origins for flexibility
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Enhanced request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Sanitization middleware (Node 20+ compatible)
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  next();
});

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// 4. Route Imports
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const aiRoutes = require('./routes/ai');

// 5. Route Mounting with error handling
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/recipes', recipeRoutes);
  app.use('/api/ai', aiRoutes);
  console.log('Routes successfully mounted');
} catch (err) {
  console.error('Failed to load routes:', err);
  process.exit(1);
}

// 6. Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the AI Recipe Finder Backend!",
    status: "operational",
    routes: {
      auth: "/api/auth",
      recipes: "/api/recipes",
      ai: "/api/ai"
    }
  });
});

// 7. Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    ai_service: process.env.HUGGING_FACE_API_KEY ? 'available' : 'unavailable',
    timestamp: new Date().toISOString()
  });
});

// 8. Error Handling (Must be last middleware)
app.use(errorHandler);

// 9. Route Debugging (Development only)
if (process.env.NODE_ENV !== 'production') {
  console.log("\nRegistered Routes:");
  
  const printRoutes = (router, prefix = '') => {
    router.stack.forEach((layer) => {
      if (layer.route) {
        // Route registered directly on app
        const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
        console.log(`${methods} ${prefix}${layer.route.path}`);
      } else if (layer.name === 'router' || layer.name === 'bound dispatch') {
        // Router mounted on a path
        const newPrefix = prefix + (layer.regexp?.source?.replace(/\\\/\^|\$/g, '') || '');
        printRoutes(layer.handle, newPrefix);
      }
    });
  };

  // Wait for routes to be initialized
  process.nextTick(() => {
    try {
      printRoutes(app._router || app.router);
    } catch (err) {
      console.warn('Could not print routes:', err.message);
    }
  });
}
// 10. Server Initialization
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// 11. Process Handlers
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app; // For testing purposes