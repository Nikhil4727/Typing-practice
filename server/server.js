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
//     ? ['https://typing-practice-3.onrender.com', 'http://localhost:5173'] // Update with your domain
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

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({ 
//     message: 'Server error', 
//     error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
//   });
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
  
//  app.get('*', (req, res, next) => {
//   try {
//     const fullUrl = req.originalUrl;
//     if (fullUrl.startsWith('http')) {
//       console.warn('Blocked suspicious request:', fullUrl);
//       return res.status(400).send('Bad request');
//     }

//     res.sendFile(path.join(staticPath, 'index.html'));
//   } catch (err) {
//     next(err);
//   }
// });

// }

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
    ? ['https://typing-practice-3.onrender.com', 'http://localhost:5173'] // Update with your domain
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Server error', 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
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
  const staticPath = path.join(__dirname, 'client', 'build');
  app.use(express.static(staticPath));
  
  // Fix: Correct the route handler for serving the SPA
   app.get('/:path*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

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