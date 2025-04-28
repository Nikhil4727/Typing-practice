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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', sentenceRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/results', resultRoutes);


// Connect to MongoDB and seed database if needed
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/typing_practice')
  .then(() => {
    console.log('Connected to MongoDB');
    if (process.env.SEED_DATABASE === 'true') {
      seedDatabase(); // seed only if flag is set
    }
  })
  .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AI server running on port ${PORT}`);
});
