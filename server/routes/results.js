





// // routes/results.js
// import express from 'express';
// import mongoose from 'mongoose';
// import Result from '../models/Result.js';
// import auth from '../middleware/auth.js';

// const router = express.Router();

// // Save a new typing result (protected route)
// router.post('/save', auth, async (req, res) => {
//   try {
//     // Get user ID from auth middleware
//     const userId = req.user.id || req.user.userId;

//     if (!userId) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'User ID not found in token' 
//       });
//     }

//     // Validate request body
//     const { wpm, accuracy, timeTaken, text } = req.body;
    
//     if (!wpm || !accuracy || !timeTaken || !text) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Missing required fields' 
//       });
//     }

//     // Debug log
//     console.log(`Saving result for user ${userId}: WPM=${wpm}, Accuracy=${accuracy}%`);

//     // Create new result document
//     const newResult = new Result({
//       user: new mongoose.Types.ObjectId(userId),
//       wpm,
//       accuracy,
//       timeTaken,
//       text,
//       date: new Date()
//     });

//     // Save to database
//     const savedResult = await newResult.save();
    
//     // Success response
//     res.status(201).json({
//       success: true,
//       message: 'Result saved successfully',
//       result: savedResult
//     });
    
//   } catch (error) {
//     console.error('Error saving result:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while saving result',
//       error: error.message
//     });
//   }
// });

// // Get user's typing history (protected route)
// router.get('/history', auth, async (req, res) => {
//   try {
//     const userId = req.user.id || req.user.userId;
    
//     const results = await Result.find({ user: userId })
//       .sort({ date: -1 })
//       .limit(10);
      
//     res.status(200).json({
//       success: true,
//       results
//     });
//   } catch (error) {
//     console.error('Error fetching history:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching history'
//     });
//   }
// });

// // Get user's statistics (protected route)
// router.get('/stats', auth, async (req, res) => {
//   try {
//     const userId = req.user.id || req.user.userId;
    
//     // Get all user results
//     const results = await Result.find({ user: userId });
    
//     if (results.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: 'No results found',
//         stats: {
//           totalTests: 0,
//           avgWpm: 0,
//           avgAccuracy: 0,
//           bestWpm: 0
//         }
//       });
//     }
    
//     // Calculate statistics
//     const totalTests = results.length;
//     const avgWpm = Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / totalTests);
//     const avgAccuracy = Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests);
//     const bestWpm = Math.max(...results.map(r => r.wpm));
    
//     res.status(200).json({
//       success: true,
//       stats: {
//         totalTests,
//         avgWpm,
//         avgAccuracy,
//         bestWpm
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching stats:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching statistics'
//     });
//   }
// });

// export default router;


import express from 'express';
import mongoose from 'mongoose';
import Result from '../models/Result.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Save a new typing result (protected route)
router.post('/save', auth, async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user.id || req.user.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User ID not found in token' 
      });
    }

    // Validate request body
    const { wpm, accuracy, timeTaken, text } = req.body;
    
    if (!wpm || !accuracy || !timeTaken || !text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Debug log
    console.log(`Saving result for user ${userId}: WPM=${wpm}, Accuracy=${accuracy}%`);

    // Create new result document
    const newResult = new Result({
      user: new mongoose.Types.ObjectId(userId),
      wpm,
      accuracy,
      timeTaken,
      text,
      date: new Date()
    });

    // Save to database
    const savedResult = await newResult.save();
    
    // Success response
    res.status(201).json({
      success: true,
      message: 'Result saved successfully',
      result: savedResult
    });
    
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving result',
      error: error.message
    });
  }
});

// Get user's typing history with filtering (protected route)
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const timeframe = req.query.timeframe || 'all';
    
    // Set up date filter
    let dateFilter = {};
    const now = new Date();
    
    if (timeframe === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      dateFilter = { date: { $gte: weekAgo } };
    } 
    else if (timeframe === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      dateFilter = { date: { $gte: monthAgo } };
    }
    
    // Combine user filter with date filter
    const query = { 
      user: userId,
      ...dateFilter
    };
    
    console.log('History query:', query);
    
    const results = await Result.find(query)
      .sort({ date: -1 })
      .limit(20); // Increased limit to show more historical data
      
    res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching history'
    });
  }
});

// Get user's statistics (protected route) 
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const timeframe = req.query.timeframe || 'all';
    
    // Set up date filter similar to history endpoint
    let dateFilter = {};
    const now = new Date();
    
    if (timeframe === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      dateFilter = { date: { $gte: weekAgo } };
    } 
    else if (timeframe === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      dateFilter = { date: { $gte: monthAgo } };
    }
    
    // Combine user filter with date filter
    const query = { 
      user: userId,
      ...dateFilter
    };
    
    // Get all user results matching the filter
    const results = await Result.find(query);
    
    console.log(`Found ${results.length} results for user ${userId} with timeframe ${timeframe}`);
    
    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No results found',
        stats: {
          totalTests: 0,
          avgWpm: 0,
          avgAccuracy: 0,
          bestWpm: 0
        }
      });
    }
    
    // Calculate statistics
    const totalTests = results.length;
    const avgWpm = Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / totalTests);
    const avgAccuracy = Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests);
    const bestWpm = Math.max(...results.map(r => r.wpm));
    
    // Return nicely formatted response
    res.status(200).json({
      success: true,
      stats: {
        totalTests,
        avgWpm,
        avgAccuracy,
        bestWpm
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

export default router;