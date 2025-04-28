import User from "../models/User";
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

export const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // 1. Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      // 2. Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // 3. Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // 4. Save to DB
      const savedUser = await newUser.save();
  
      // 5. Respond with user ID
      res.status(201).json({
        message: 'User registered successfully',
        userId: savedUser._id,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  };
  

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 1. Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // 2. Check password match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // 3. Generate token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // 4. Respond with token and user info
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };