const Question = require('../models/Question');
const User = require('../models/User');

exports.getQuestions = async (req, res) => {
  try {
    const { topic, difficulty, status } = req.query;
    const filter = {};
    
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (status) filter.status = status;
    else filter.status = 'active';

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    let isCorrect = false;

    // HTML Question Validation (tags only, ignore content)
    if (question.topic === 'html' && question.expectedHTML) {
      isCorrect = validateHTMLTags(userAnswer, question.expectedHTML);
    } 
    // CSS Question Validation
    else if (question.topic === 'css' && question.expectedCSS) {
      isCorrect = validateCSS(userAnswer, question.expectedCSS);
    }
    
    if (isCorrect) {
      const user = await User.findById(req.user.id);
      const existingProgress = user.progress.find(p => p.questionId.toString() === questionId);
      
      if (!existingProgress) {
        user.points += question.points;
        user.progress.push({
          questionId,
          completed: true,
          attempts: 1,
          completedAt: new Date()
        });
        await user.save();
      } else if (!existingProgress.completed) {
        user.points += question.points;
        existingProgress.completed = true;
        existingProgress.attempts += 1;
        existingProgress.completedAt = new Date();
        await user.save();
      } else {
        return res.status(200).json({
          success: true,
          correct: true,
          points: 0,
          message: 'Already completed! No additional points awarded.',
          alreadyCompleted: true
        });
      }
    } else {
      const user = await User.findById(req.user.id);
      const existingProgress = user.progress.find(p => p.questionId.toString() === questionId);
      
      if (existingProgress) {
        existingProgress.attempts += 1;
      } else {
        user.progress.push({
          questionId,
          completed: false,
          attempts: 1
        });
      }
      await user.save();
    }

    res.status(200).json({
      success: true,
      correct: isCorrect,
      points: isCorrect ? question.points : 0,
      newPoints: isCorrect ? (await User.findById(req.user.id)).points : null,
      message: isCorrect ? 'Correct! Well done!' : 'Not quite right. Check your ' + (question.topic === 'html' ? 'HTML tags' : 'CSS properties') + '.',
      hint: !isCorrect && question.hints?.length > 0 ? question.hints[0] : null
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Validate HTML by comparing tags only (ignore inner content)
function validateHTMLTags(userHTML, expectedHTML) {
  const extractTags = (html) => {
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    const tags = [];
    const tagRegex = /<\/?([a-z][a-z0-9]*)([^>]*)>/gi;
    const boilerplate = ['!doctype', 'html', 'head', 'body', 'meta', 'title', 'link', 'script'];
    let match;
    
    while ((match = tagRegex.exec(html)) !== null) {
      const tagName = match[1].toLowerCase();
      
      // Skip boilerplate tags
      if (boilerplate.includes(tagName)) continue;
      
      const attributes = match[2].trim();
      const classMatch = attributes.match(/class=["']([^"']*)["']/i);
      const idMatch = attributes.match(/id=["']([^"']*)["']/i);
      
      tags.push({
        tag: tagName,
        isClosing: match[0].startsWith('</'),
        class: classMatch ? classMatch[1].trim().split(/\s+/).sort().join(' ') : '',
        id: idMatch ? idMatch[1].trim() : ''
      });
    }
    
    return tags;
  };

  const userTags = extractTags(userHTML);
  const expectedTags = extractTags(expectedHTML);

  if (userTags.length !== expectedTags.length) return false;

  for (let i = 0; i < userTags.length; i++) {
    const userTag = userTags[i];
    const expectedTag = expectedTags[i];
    
    if (userTag.tag !== expectedTag.tag ||
        userTag.isClosing !== expectedTag.isClosing ||
        userTag.class !== expectedTag.class ||
        userTag.id !== expectedTag.id) {
      return false;
    }
  }

  return true;
}

// Validate CSS
function validateCSS(userCSS, expectedCSS) {
  const normalizeCSS = (css) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .trim()
      .toLowerCase();
  };

  const normalizedUser = normalizeCSS(userCSS);
  const normalizedExpected = normalizeCSS(expectedCSS);
  
  if (normalizedUser === normalizedExpected) {
    return true;
  }
  
  // Check if all required properties are present
  const requiredProps = normalizedExpected.match(/[a-z-]+:/g) || [];
  const userProps = normalizedUser.match(/[a-z-]+:/g) || [];
  
  return requiredProps.every(prop => userProps.includes(prop));
}
