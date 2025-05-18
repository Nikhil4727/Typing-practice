


// models/Result.js
import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  wpm: Number,
  accuracy: Number,
  timeTaken: Number,
  text: String,
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Result = mongoose.model('result', ResultSchema);
export default Result;
