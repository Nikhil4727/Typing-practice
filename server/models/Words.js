// import mongoose from 'mongoose';

// const wordSchema = new mongoose.Schema({
//   text: { type: String, required: true }
// });

// const Word = mongoose.model('Word', wordSchema);
// export default Word;


import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['word', 'punctuation', 'number', 'quote'],
    default: 'word'
  }
}, { timestamps: true });

const Word = mongoose.model('Word', wordSchema);

export default Word;