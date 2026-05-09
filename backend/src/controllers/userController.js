const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email points progress createdAt')
      .sort({ points: -1 })
      .limit(100);
    
    const usersWithStats = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      points: user.points || 0,
      completedCount: user.progress ? user.progress.filter(p => p.completed).length : 0,
      createdAt: user.createdAt
    }));
    
    res.status(200).json({ success: true, count: usersWithStats.length, data: usersWithStats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('progress.questionId');
    res.status(200).json({ success: true, data: user.progress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const completedCount = user.progress.filter(p => p.completed).length;
    
    // Calculate global rank
    const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;
    
    // Calculate progress by topic
    const Question = require('../models/Question');
    const allQuestions = await Question.find({ status: 'active' });
    
    const progressByTopic = {};
    
    // Group questions by topic and difficulty
    allQuestions.forEach(q => {
      if (!progressByTopic[q.topic]) {
        progressByTopic[q.topic] = {};
      }
      if (!progressByTopic[q.topic][q.difficulty]) {
        progressByTopic[q.topic][q.difficulty] = { total: 0, completed: 0 };
      }
      progressByTopic[q.topic][q.difficulty].total++;
    });
    
    // Count completed questions by matching questionId
    user.progress.filter(p => p.completed).forEach(p => {
      const question = allQuestions.find(q => q._id.toString() === p.questionId.toString());
      if (question && progressByTopic[question.topic] && progressByTopic[question.topic][question.difficulty]) {
        progressByTopic[question.topic][question.difficulty].completed++;
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalPoints: user.points,
        completedChallenges: completedCount,
        totalAttempts: user.progress.reduce((sum, p) => sum + p.attempts, 0),
        globalRank: rank,
        progressByTopic
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
