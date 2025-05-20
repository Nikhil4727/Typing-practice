
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
    ? ['https://typing-practice-1.onrender.com', 'https://typing-practice-usg6.onrender.com']
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  console.log('Setting up static file serving for production...');
  
  // Based on the Vite structure, we know we need to look for frontend/dist
  const potentialBuildPaths = [
    path.join(__dirname, '..', 'frontend', 'dist'),  // From /server to /frontend/dist
    path.join('/opt/render/project/src/frontend/dist'), // Absolute path for Render
  ];
  
  let foundBuildPath = null;
  
  // Check each potential path for the build files
  for (const buildPath of potentialBuildPaths) {
    try {
      const indexPath = path.join(buildPath, 'index.html');
      console.log(`Checking for index.html at: ${indexPath}`);
      
      if (fs.existsSync(indexPath)) {
        console.log(`✅ Found frontend build at: ${buildPath}`);
        foundBuildPath = buildPath;
        break;
      }
    } catch (err) {
      console.log(`Error checking path ${buildPath}: ${err.message}`);
    }
  }
  
  // If we found a valid build path, use it
  if (foundBuildPath) {
    console.log(`Using frontend build path: ${foundBuildPath}`);
    
    // Serve static files from the build directory
    app.use(express.static(foundBuildPath));
    
    // Catch-all route for SPA to handle client-side routing
    app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      
      res.sendFile(path.join(foundBuildPath, 'index.html'));
    });
  } else {
    // Check frontend directory structure to help with debugging
    console.log('No build files found. Checking frontend directory structure...');
    
    try {
      const frontendPath = path.join('/opt/render/project/src/frontend');
      if (fs.existsSync(frontendPath)) {
        const frontendFiles = fs.readdirSync(frontendPath);
        console.log(`Files/directories in frontend: ${frontendFiles.join(', ')}`);
        
        // Look for typical build script locations
        if (frontendFiles.includes('package.json')) {
          console.log('Found package.json in frontend directory.');
          
          try {
            const packageJsonPath = path.join(frontendPath, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            console.log('Build scripts in package.json:', packageJson.scripts ? Object.keys(packageJson.scripts) : 'None');
          } catch (err) {
            console.log('Error reading package.json:', err.message);
          }
        }
      } else {
        console.log('Frontend directory not found at expected location');
      }
    } catch (err) {
      console.log(`Error checking frontend directory: ${err.message}`);
    }
    
    // Fall back to API-only mode
    console.log('⚠️ No frontend build found! Running in API-only mode.');
    app.get('/', (req, res) => {
      res.json({ 
        status: 'API running',
        message: 'Frontend build not found. This server is running in API-only mode.',
        endpoints: ['/api/auth', '/api/sentence', '/api/words', '/api/results']
      });
    });
  }
}

// Error handling middleware
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