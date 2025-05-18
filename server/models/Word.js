



// models/Word.js
import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  text: String,
  type: String
});

const Word = mongoose.model('Word', wordSchema);
export default Word;
