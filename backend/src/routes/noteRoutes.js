const express = require('express');
const router = express.Router();
const { getNotes, getNote, createNote, updateNote, deleteNote, trackDownload } = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', protect, authorize('admin'), createNote);
router.put('/:id', protect, authorize('admin'), updateNote);
router.post('/:id/download', trackDownload);
router.delete('/:id', protect, authorize('admin'), deleteNote);

module.exports = router;
