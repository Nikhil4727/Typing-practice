// import mongoose from 'mongoose';

// const resultSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   accuracy: Number,
//   wpm: Number,
//   createdAt: { type: Date, default: Date.now }
// });

// const Result = mongoose.model('Result', resultSchema);
// export default Result;


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
