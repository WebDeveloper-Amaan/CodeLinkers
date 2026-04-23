const express = require('express');
const router = express.Router();
const { enrollFace, enrollVoice, verifyFace, verifyVoice } = require('../controllers/biometricController');
const { protect } = require('../middleware/auth');

router.post('/enroll-face', protect, enrollFace);
router.post('/enroll-voice', protect, enrollVoice);
router.post('/verify-face', verifyFace);
router.post('/verify-voice', verifyVoice);

module.exports = router;
