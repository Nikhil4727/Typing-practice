import express from 'express';
import User from '../models/User.js'; // Make sure the path is correct
import jwt from 'jsonwebtoken';

import Result from '../models/Result.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log('Incoming data:', req.body);
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ username, email, password });

    // Save to MongoDB
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// In your server.js or middleware file

// Create middleware for token verification
// Enhanced token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log('Auth header:', authHeader ? 'Present' : 'Missing');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token received:', token.substring(0, 15) + '...');
  
  try {
    // Log environment variables (excluding the actual secret)
    console.log('JWT_SECRET defined:', process.env.JWT_SECRET ? 'Yes' : 'No');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token successfully verified! Decoded payload:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.name, error.message);
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Use the middleware to protect your route
router.post('/save', verifyToken, async (req, res) => {
  console.log('Decoded user from token:', req.user);
  const userId = req.user.userId || req.user.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Invalid token: userId not found' });
  }

  const { wpm, accuracy, timeTaken, text } = req.body;

  if (!wpm || !accuracy || !timeTaken || !text) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const newResult = new Result({
      user: mongoose.Types.ObjectId(userId) ,
      wpm,
      accuracy,
      timeTaken,
      text,
      date: new Date().toISOString()
    });

    const savedResult = await newResult.save();
    res.status(201).json({ success: true, result: savedResult });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ success: false, message: 'Error saving result', error: error.message });
  }
});

// router.post('/api/results/save', async (req, res) => {
//   try {
//     const { wpm, accuracy, timeTaken, text, date } = req.body;
//     const userId = req.user?.id; // Assuming you're using some middleware to get user from token

//     // Check if required fields are present
//     if (!wpm || !accuracy || !text || !date || !userId) {
//       return res.status(400).json({ success: false, message: 'Missing data' });
//     }

//     // Save result to DB (pseudo-code)
//     await Result.create({ userId, wpm, accuracy, timeTaken, text, date });

//     res.status(200).json({ success: true, message: 'Result saved' });
//   } catch (err) {
//     console.error('Error saving result:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });





router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET, // Make sure you have this in your .env
      { expiresIn: '1h' }
    );

    // ✅ Send token back in response
    res.status(200).json({
      message: 'Login successful',
      username: user.username,
      userId: user._id,
      token // <-- your frontend can now receive and store this
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
