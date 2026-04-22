const Video = require('../models/Video');

exports.getVideos = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    
    if (category) filter.category = category;

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    req.body.addedBy = req.user.id;
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
