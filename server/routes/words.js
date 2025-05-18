
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
