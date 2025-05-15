const mongoose = require('mongoose');
const configDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error('[ERROR] MONGODB_URL environment variable is not defined');
      process.exit(1);
    }
    
    console.log('[INFO] Connecting to MongoDB...');
    
    // High-traffic connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Connection pool settings for high load
      maxPoolSize: 500,               // Increase for high traffic
      minPoolSize: 5,                // Maintain minimum connections
      
      // Timeout settings
      connectTimeoutMS: 30000,       // Connection timeout
      socketTimeoutMS: 45000,        // Socket timeout
      serverSelectionTimeoutMS: 30000, // Server selection timeout
      
      // Read operations from secondary nodes when possible
      // Only applies when using MongoDB replica sets
      readPreference: 'secondaryPreferred'
    };
    
    await mongoose.connect(process.env.MONGODB_URL, options);
    
    console.log('[INFO] Successfully connected to MongoDB');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`[ERROR] MongoDB connection error: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('[WARNING] MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('[INFO] MongoDB reconnected');
    });
    
    // Add connection monitoring and health checks for production
    if (process.env.NODE_ENV === 'production') {
      // Monitor slow queries in production
      mongoose.set('debug', (collectionName, method, query, doc) => {
        if (global.queryStartTime) {
          const executionTime = Date.now() - global.queryStartTime;
          if (executionTime > 1000) { // Log queries taking more than 1 second
            console.warn(`[SLOW QUERY] ${collectionName}.${method} took ${executionTime}ms`);
          }
        }
        global.queryStartTime = Date.now();
      });
      
      // Periodic health check
      setInterval(() => {
        if (mongoose.connection.readyState !== 1) {
          console.warn('[WARNING] MongoDB connection not ready. Current state:', getConnectionStateName(mongoose.connection.readyState));
        }
      }, 60000); // Check every minute
    }
    
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('[INFO] MongoDB connection closed due to app termination');
        process.exit(0);
      } catch (err) {
        console.error('[ERROR] Error during MongoDB shutdown:', err.message);
        process.exit(1);
      }
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error(`[ERROR] Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

function getConnectionStateName(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  return states[state] || 'unknown';
}

module.exports = configDB;