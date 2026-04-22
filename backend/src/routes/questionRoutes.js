const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  submitAnswer
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.post('/', protect, authorize('admin'), createQuestion);
router.put('/:id', protect, authorize('admin'), updateQuestion);
router.delete('/:id', protect, authorize('admin'), deleteQuestion);
router.post('/submit', protect, submitAnswer);

module.exports = router;
