const express = require('express');
const router = express.Router();
const { getVideos, createVideo, deleteVideo } = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getVideos);
router.post('/', protect, authorize('admin'), createVideo);
router.delete('/:id', protect, authorize('admin'), deleteVideo);

module.exports = router;
