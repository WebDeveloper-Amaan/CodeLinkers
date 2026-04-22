const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['html', 'css', 'javascript', 'dsa', 'dbms', 'python', 'java']
  },
  duration: {
    type: String
  },
  channelName: {
    type: String
  },
  description: {
    type: String
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
