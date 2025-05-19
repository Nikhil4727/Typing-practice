// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import authRoutes from './routes/authRoutes.js';
// import sentenceRoutes from './routes/sentence.js';
// import wordsRoutes from './routes/words.js';
// import resultRoutes from './routes/results.js';

// // Load environment variables from .env file
// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Validate environment variables at startup
// console.log("Environment variables check:");
// console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "Present" : "Missing");
// console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "Present" : "Missing");
// console.log("- NODE_ENV:", process.env.NODE_ENV || "development");
// console.log("- PORT:", process.env.PORT || "5000");

// // Configure CORS
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://typing-practice-3.onrender.com', 'https://typing-practice-usg6.onrender.com']
//     : 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// // Request logger middleware
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
//   next();
// });

// // Check JWT_SECRET
// if (!process.env.JWT_SECRET) {
//   console.error('WARNING: JWT_SECRET is not set. Authentication will fail!');
// }

// // Mount API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/sentence', sentenceRoutes);
// app.use('/api/words', wordsRoutes);
// app.use('/api/results', resultRoutes);

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   const staticPath = path.join(__dirname, 'client', 'build');
//   app.use(express.static(staticPath));
  
//   // Try a different approach to the catch-all route
//   // Instead of '*' or '/*', use explicit middleware
//   app.use((req, res) => {
//     res.sendFile(path.join(staticPath, 'index.html'));
//   });
// }

// // Error handling middleware - move this after all routes including the catch-all
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({ 
//     message: 'Server error', 
//     error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
//   });
// });

// // Connect to MongoDB
// const MONGODB_URI = process.env.MONGODB_URI;
// if (!MONGODB_URI) {
//   console.error('FATAL: MONGODB_URI is required!');
//   process.exit(1);
// }

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     console.log('✅ Connected to MongoDB successfully');
//   })
//   .catch((error) => {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
// });




import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import sentenceRoutes from './routes/sentence.js';
import wordsRoutes from './routes/words.js';
import resultRoutes from './routes/results.js';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Validate environment variables at startup
console.log("Environment variables check:");
console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "Present" : "Missing");
console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "Present" : "Missing");
console.log("- NODE_ENV:", process.env.NODE_ENV || "development");
console.log("- PORT:", process.env.PORT || "5000");

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://typing-practice-3.onrender.com', 'https://typing-practice-usg6.onrender.com']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Check JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('WARNING: JWT_SECRET is not set. Authentication will fail!');
}

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/sentence', sentenceRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/results', resultRoutes);

// Debug potential client build paths in production
if (process.env.NODE_ENV === 'production') {
  console.log('Checking for client build files...');
  
  // Define possible build paths to check
  const potentialPaths = [
    path.join(__dirname, 'client', 'build'),
    path.join(__dirname, '..', 'client', 'build'),
    path.join(__dirname, '..', 'client', 'dist'),
    path.join(__dirname, 'client', 'dist'),
    path.join(__dirname, '..', '..', 'client', 'build'),
    path.join(__dirname, '..', '..', 'client', 'dist')
  ];
  
  // Check each path and log results
  let foundPath = null;
  potentialPaths.forEach(pathToCheck => {
    try {
      const indexPath = path.join(pathToCheck, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log(`✅ Found client build at: ${pathToCheck}`);
        foundPath = pathToCheck;
      } else {
        console.log(`❌ No index.html found at: ${pathToCheck}`);
      }
    } catch (err) {
      console.log(`❌ Error checking path ${pathToCheck}: ${err.message}`);
    }
  });
  
  // If we found a valid path, use it
  if (foundPath) {
    console.log(`Using client build path: ${foundPath}`);
    app.use(express.static(foundPath));
    
    // Catch-all route to serve the index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(foundPath, 'index.html'));
    });
  } else {
    // Check if we're running in a Render.com environment
    if (process.env.RENDER) {
      console.log('Running on Render.com, checking Render-specific paths...');
      
      // On Render, the structure might be different
      const renderPath = '/opt/render/project/src';
      console.log(`Searching for client build in: ${renderPath}`);
      
      try {
        // List directories in the Render path to help with debugging
        const dirs = fs.readdirSync(renderPath);
        console.log(`Directories in ${renderPath}:`, dirs);
      } catch (err) {
        console.log(`Error reading ${renderPath}: ${err.message}`);
      }
      
      // Add more specific debug info for common Render paths
      const renderPaths = [
        path.join(renderPath, 'client', 'build'),
        path.join(renderPath, 'client', 'dist'),
        path.join(renderPath, 'build'),
        path.join(renderPath, 'dist')
      ];
      
      renderPaths.forEach(pathToCheck => {
        try {
          if (fs.existsSync(pathToCheck)) {
            console.log(`✅ Directory exists: ${pathToCheck}`);
            try {
              const files = fs.readdirSync(pathToCheck);
              console.log(`Files in ${pathToCheck}:`, files);
              if (files.includes('index.html')) {
                console.log(`✅ Found index.html in: ${pathToCheck}`);
                foundPath = pathToCheck;
              }
            } catch (err) {
              console.log(`Error reading ${pathToCheck}: ${err.message}`);
            }
          } else {
            console.log(`❌ Directory does not exist: ${pathToCheck}`);
          }
        } catch (err) {
          console.log(`Error checking path ${pathToCheck}: ${err.message}`);
        }
      });
      
      if (foundPath) {
        console.log(`Using client build path: ${foundPath}`);
        app.use(express.static(foundPath));
        
        // Catch-all route to serve the index.html
        app.get('*', (req, res) => {
          res.sendFile(path.join(foundPath, 'index.html'));
        });
      } else {
        console.error('⚠️ No client build found! Configuring API-only mode.');
        
        // API-only fallback route
        app.get('/', (req, res) => {
          res.json({ 
            status: 'API running',
            message: 'Client build not found. This server is running in API-only mode.',
            endpoints: ['/api/auth', '/api/sentence', '/api/words', '/api/results']
          });
        });
      }
    }
  }
}

// Error handling middleware - move this after all routes including the catch-all
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Server error', 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI is required!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});