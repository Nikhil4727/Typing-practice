import express from 'express';
import axios from 'axios';
import Word from '../models/Word.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Primary: Fetch random words from external API
    const response = await axios.get('https://random-word-api.herokuapp.com/word?number=7');
    const sentence = response.data.join(' ');
    return res.json({ sentence });
  } catch (apiError) {
    console.error('API failed:', apiError.message);

    try {
      // Fallback: Fetch 7 random words from your MongoDB database
      const words = await Word.aggregate([{ $sample: { size: 7 } }]);
      const sentence = words.map(w => w.text).join(' ');
      return res.json({ sentence });
    } catch (dbError) {
      console.error('Database failed:', dbError.message);
      return res.status(500).json({ message: 'Could not generate sentence' });
    }
  }
});

export default router;
