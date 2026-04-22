const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const questionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true,
    enum: ['html', 'css', 'javascript', 'python', 'java'],
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'medium', 'advanced'],
    index: true
  },
  points: {
    type: Number,
    required: true,
    default: 5
  },
  hints: [String],
  initialHTML: {
    type: String,
    default: ''
  },
  initialCSS: {
    type: String,
    default: ''
  },
  expectedCSS: {
    type: String
  },
  expectedHTML: {
    type: String
  },
  targetImage: {
    type: String
  },
  charCount: {
    type: Number,
    default: 3
  },
  charTheme: {
    type: String,
    default: 'wizard'
  },
  boxSize: {
    type: Number,
    default: 50
  },
  containerHeight: {
    type: Number,
    default: 250
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'disabled'],
    default: 'active',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-increment questionId
questionSchema.plugin(AutoIncrement, { inc_field: 'questionId' });

// Compound indexes for faster queries
questionSchema.index({ topic: 1, difficulty: 1, status: 1 });
questionSchema.index({ status: 1, createdAt: -1 });

// Update timestamp on save
questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema);
