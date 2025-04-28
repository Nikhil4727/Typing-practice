// import express from 'express';
// import Result from '../models/Result.js';
// import auth from '../middleware/auth.js';

// const router = express.Router();

// // POST /api/results/save
// router.post('/save', auth, async (req, res) => {
//   try {
//     const { accuracy, wpm } = req.body;
//     const result = new Result({ userId: req.user.userId, accuracy, wpm });
//     await result.save();
//     res.status(201).json({ message: 'Performance saved' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to save performance' });
//   }
// });

// // GET /api/results/me
// router.get('/me', auth, async (req, res) => {
//   try {
//     const results = await Result.find({ userId: req.user.userId }).sort({ createdAt: -1 });
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch performances' });
//   }
// });

// export default router;


// routes/results.js
// routes/results.js
import express from 'express';
import Result from '../models/Result.js';
import mongoose from 'mongoose'; // Import mongoose for ObjectId handling
import auth from '../middleware/auth.js';

const router = express.Router();

// Save typing result - Protected route
router.post('/save', auth, async (req, res) => {
  try {
    const { wpm, accuracy, timeTaken, text, date } = req.body;
    const userId = req.user.userId || req.user.id; // Handle both possible properties
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID not found in token' 
      });
    }
    
    console.log('Creating result with user ID:', userId);
    
    const newResult = new Result({
      user: new mongoose.Types.ObjectId(userId), // Ensure proper ObjectId conversion
      wpm,
      accuracy,
      timeTaken,
      text,
      date
    });

    const savedResult = await newResult.save();
    
    res.json({ success: true, result: savedResult });
  } catch (err) {
    console.error('Error saving result:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
});

// Get user's results - Protected route
router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const results = await Result.find({ user: userId })
      .sort({ date: -1 })
      .limit(10);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// In routes/results.js
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    // Find all results for this user
    const results = await Result.find({ user: new mongoose.Types.ObjectId(userId) });
    
    // Calculate summary stats
    const totalTests = results.length;
    const averageWpm = results.length > 0 
      ? results.reduce((sum, result) => sum + result.wpm, 0) / results.length 
      : 0;
    const averageAccuracy = results.length > 0 
      ? results.reduce((sum, result) => sum + result.accuracy, 0) / results.length 
      : 0;
    const bestWpm = results.length > 0 
      ? Math.max(...results.map(result => result.wpm)) 
      : 0;
    
    res.json({
      totalTests,
      averageWpm,
      averageAccuracy,
      bestWpm
    });
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// In routes/results.js
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const timeframe = req.query.timeframe || 'all';
    
    let query = { user: new mongoose.Types.ObjectId(userId) };
    
    // Add date filters based on timeframe
    if (timeframe === 'week') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query.date = { $gte: lastWeek };
    } else if (timeframe === 'month') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      query.date = { $gte: lastMonth };
    }
    
    // Find results and sort by date descending (newest first)
    const results = await Result.find(query).sort({ date: -1 });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
