



// import express from 'express';
// import Word from '../models/Words.js';

// const router = express.Router();

// // Get random words based on content type
// router.get('/random', async (req, res) => {
//   try {
//     // Get content type from query parameter, default to 'word'
//     const contentType = req.query.type || 'word';
//     console.log("Requested content type:", contentType);
    
//     // First check if we have any documents of this type
//     const count = await Word.countDocuments({ type: contentType });
//     console.log(`Found ${count} documents with type: ${contentType}`);
    
//     let words;
    
//     if (contentType === 'word') {
//       // For basic word type, return multiple random words
//       words = await Word.aggregate([
//         { $match: { type: 'word' } },
//         { $sample: { size: 15 } }, // Get 15 random words
//       ]);
      
//       // Extract just the text from the results
//       words = words.map(word => word.text);
//       console.log(`Returning ${words.length} words`);
//     } else {
//       // For other types, return a single sentence/quote
//       const result = await Word.aggregate([
//         { $match: { type: contentType } },
//         { $sample: { size: 1 } }, // Get 1 random sentence
//       ]);
      
//       console.log("Aggregate result:", result);
      
//       if (result && result.length > 0) {
//         // Return the sentence as a special format that the frontend will understand
//         words = { fullText: result[0].text };
//         console.log("Returning fullText:", words.fullText);
//       } else {
//         // Fallback to words if no content found
//         console.log("No content found for type, falling back to words");
//         const fallbackWords = await Word.aggregate([
//           { $match: { type: 'word' } },
//           { $sample: { size: 15 } },
//         ]);
//         words = fallbackWords.map(word => word.text);
//         console.log(`Returning ${words.length} fallback words`);
//       }
//     }
    
//     // Send a proper response with the data
//     res.status(200).json(words);
//   } catch (error) {
//     console.error('Error fetching words:', error);
//     res.status(500).json({ error: 'Failed to fetch words', message: error.message });
//   }
// });

// export default router;

// routes/wordRoutes.js
// wordRoutes.js
import express from 'express';
import Word from '../models/Word.js';

const router = express.Router();

router.get('/random', async (req, res) => {
  const type = req.query.type || 'word';

  try {
    const words = await Word.find({ type });
    if (!words.length) {
      return res.json({ fullText: "Error loading content" });
    }

    const count = (type === 'word') ? 20 : 1;
    const selected = [];

    for (let i = 0; i < count; i++) {
      const rand = words[Math.floor(Math.random() * words.length)];
      if (rand?.text) selected.push(rand.text);
    }

    const response = (type === 'sentence' || type === 'punctuation')
      ? { fullText: selected.join(' ') }
      : selected;

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ fullText: "Error loading content" });
  }
});

export default router;
