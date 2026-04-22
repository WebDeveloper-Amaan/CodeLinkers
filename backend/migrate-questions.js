// Migration Script - Add questionId to existing questions
// Run this once after updating the schema

const mongoose = require('mongoose');
const Question = require('./src/models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codelinkers';

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all questions without questionId
    const questions = await Question.find({ questionId: { $exists: false } }).sort({ createdAt: 1 });
    
    console.log(`Found ${questions.length} questions to migrate`);

    // Assign questionId sequentially
    for (let i = 0; i < questions.length; i++) {
      questions[i].questionId = i + 1;
      await questions[i].save();
      console.log(`Migrated question ${i + 1}: ${questions[i].title}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
