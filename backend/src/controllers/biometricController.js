const axios = require('axios');
const User = require('../models/User');

const PYTHON_SERVICE_URL = 'http://localhost:5001';

// Enroll Face
exports.enrollFace = async (req, res) => {
  try {
    const { faceImage, pin } = req.body;
    
    if (!faceImage) {
      return res.status(400).json({ success: false, message: 'Face image required' });
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: '4-digit PIN required' });
    }

    const response = await axios.post(`${PYTHON_SERVICE_URL}/extract-face`, {
      image: faceImage
    });

    if (!response.data.success) {
      return res.status(400).json({ success: false, message: response.data.error });
    }

    await User.findByIdAndUpdate(req.user.id, {
      faceEmbedding: response.data.embedding,
      biometricEnabled: true,
      biometricPin: pin
    });

    res.json({ success: true, message: 'Face enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Enroll Voice
exports.enrollVoice = async (req, res) => {
  try {
    const { voiceAudio, pin } = req.body;
    
    if (!voiceAudio) {
      return res.status(400).json({ success: false, message: 'Voice audio required' });
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: '4-digit PIN required' });
    }

    const response = await axios.post(`${PYTHON_SERVICE_URL}/extract-voice`, {
      audio: voiceAudio
    });

    if (!response.data.success) {
      return res.status(400).json({ success: false, message: response.data.error });
    }

    await User.findByIdAndUpdate(req.user.id, {
      voiceEmbedding: response.data.embedding,
      biometricEnabled: true,
      biometricPin: pin
    });

    res.json({ success: true, message: 'Voice enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Face Login
exports.verifyFace = async (req, res) => {
  try {
    const { faceImage, pin } = req.body;
    
    if (!faceImage) {
      return res.status(400).json({ success: false, message: 'Face image required' });
    }

    const response = await axios.post(`${PYTHON_SERVICE_URL}/extract-face`, {
      image: faceImage
    });

    if (!response.data.success) {
      return res.status(400).json({ success: false, message: response.data.error });
    }

    const newEmbedding = response.data.embedding;
    const users = await User.find({ faceEmbedding: { $exists: true, $ne: null } }).select('+biometricPin');

    let matchedUser = null;
    let bestSimilarity = 0;

    for (const user of users) {
      const similarity = cosineSimilarity(newEmbedding, user.faceEmbedding);
      const euclideanDist = euclideanDistance(newEmbedding, user.faceEmbedding);
      const manhattanDist = manhattanDistance(newEmbedding, user.faceEmbedding);
      
      // Calculate combined score
      const euclideanSimilarity = Math.max(0, 1 - (euclideanDist / 2));
      const manhattanSimilarity = Math.max(0, 1 - (manhattanDist / 128));
      const combinedScore = (
        similarity * 0.5 +
        euclideanSimilarity * 0.3 +
        manhattanSimilarity * 0.2
      );
      
      // Strict matching criteria - ALL conditions must be met
      if (
        similarity >= 0.75 &&           // Cosine similarity threshold (stricter)
        euclideanDist <= 0.4 &&         // Euclidean distance threshold (stricter)
        manhattanDist <= 50 &&          // Manhattan distance threshold
        combinedScore >= 0.70 &&        // Combined score threshold
        combinedScore > bestSimilarity
      ) {
        bestSimilarity = combinedScore;
        matchedUser = user;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ success: false, message: 'Face not recognized', needsPin: false });
    }

    // Check if PIN is required and validate
    if (matchedUser.biometricPin) {
      if (!pin) {
        return res.status(200).json({ 
          success: false, 
          needsPin: true, 
          userId: matchedUser._id,
          userName: matchedUser.name,
          message: 'PIN required for verification' 
        });
      }
      
      if (pin !== matchedUser.biometricPin) {
        return res.status(401).json({ success: false, message: 'Invalid PIN', needsPin: false });
      }
    }

    const token = matchedUser.generateAuthToken();
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: matchedUser._id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          points: matchedUser.points
        },
        similarity: bestSimilarity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Voice Login
exports.verifyVoice = async (req, res) => {
  try {
    const { voiceAudio, pin } = req.body;
    
    if (!voiceAudio) {
      return res.status(400).json({ success: false, message: 'Voice audio required' });
    }

    const response = await axios.post(`${PYTHON_SERVICE_URL}/extract-voice`, {
      audio: voiceAudio
    });

    if (!response.data.success) {
      return res.status(400).json({ success: false, message: response.data.error });
    }

    const newEmbedding = response.data.embedding;
    const users = await User.find({ voiceEmbedding: { $exists: true, $ne: null } }).select('+biometricPin');

    let matchedUser = null;
    let bestSimilarity = 0;

    for (const user of users) {
      const similarity = cosineSimilarity(newEmbedding, user.voiceEmbedding);
      const euclideanDist = euclideanDistance(newEmbedding, user.voiceEmbedding);
      const manhattanDist = manhattanDistance(newEmbedding, user.voiceEmbedding);
      
      // Calculate combined score
      const euclideanSimilarity = Math.max(0, 1 - (euclideanDist / 2));
      const manhattanSimilarity = Math.max(0, 1 - (manhattanDist / 128));
      const combinedScore = (
        similarity * 0.5 +
        euclideanSimilarity * 0.3 +
        manhattanSimilarity * 0.2
      );
      
      // Strict matching criteria for voice
      if (
        similarity >= 0.75 &&
        euclideanDist <= 0.4 &&
        manhattanDist <= 50 &&
        combinedScore >= 0.70 &&
        combinedScore > bestSimilarity
      ) {
        bestSimilarity = combinedScore;
        matchedUser = user;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ success: false, message: 'Voice not recognized', needsPin: false });
    }

    // Check if PIN is required and validate
    if (matchedUser.biometricPin) {
      if (!pin) {
        return res.status(200).json({ 
          success: false, 
          needsPin: true, 
          userId: matchedUser._id,
          userName: matchedUser.name,
          message: 'PIN required for verification' 
        });
      }
      
      if (pin !== matchedUser.biometricPin) {
        return res.status(401).json({ success: false, message: 'Invalid PIN', needsPin: false });
      }
    }

    const token = matchedUser.generateAuthToken();
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: matchedUser._id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          points: matchedUser.points
        },
        similarity: bestSimilarity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: Cosine Similarity
function cosineSimilarity(arr1, arr2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < arr1.length; i++) {
    dotProduct += arr1[i] * arr2[i];
    norm1 += arr1[i] * arr1[i];
    norm2 += arr2[i] * arr2[i];
  }
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Helper: Euclidean Distance
function euclideanDistance(arr1, arr2) {
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    const diff = arr1[i] - arr2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

// Helper: Manhattan Distance
function manhattanDistance(arr1, arr2) {
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += Math.abs(arr1[i] - arr2[i]);
  }
  return sum;
}
