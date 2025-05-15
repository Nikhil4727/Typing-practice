



import express from 'express';
import User from '../models/User.js';
import Result from '../models/Result.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

// Get JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Log JWT_SECRET status for debugging (don't log the actual secret)
console.log('JWT_SECRET status:', JWT_SECRET ? 'Available' : 'Missing');

router.post('/register', async (req, res) => {
  console.log('Incoming data:', req.body);
  const { username, email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const newUser = new User({ 
      username: username || email.split('@')[0], // Use email prefix if username not provided
      email, 
      password: hashedPassword 
    });

    // Save to MongoDB
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
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
      user: new  mongoose.Types.ObjectId(userId),
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

router.post('/login', async (req, res) => {
  console.log('Login attempt with:', { email: req.body.email, passwordProvided: !!req.body.password });
  
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Verify JWT_SECRET is set
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not configured in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if we're using bcrypt for authentication
    if (user.password.startsWith('$2')) {
      // Password is hashed with bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
    } else {
      // Plain text password comparison (legacy support)
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      
      // Optional: Update to bcrypt hash for better security
      console.log('Warning: User has plain text password. Consider updating to bcrypt.');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful for:', user.username);
    
    // Send token back in response
    res.status(200).json({
      message: 'Login successful',
      username: user.username,
      userId: user._id,
      token
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

export default router;