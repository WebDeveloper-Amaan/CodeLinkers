const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
const authValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
  ],
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
    validate
  ]
};

// Question validation rules
const questionValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title too long'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required'),
    body('topic')
      .notEmpty().withMessage('Topic is required')
      .isIn(['html', 'css', 'javascript', 'flexbox', 'grid']).withMessage('Invalid topic'),
    body('difficulty')
      .notEmpty().withMessage('Difficulty is required')
      .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty'),
    body('points')
      .isInt({ min: 1, max: 1000 }).withMessage('Points must be between 1 and 1000'),
    validate
  ],
  submit: [
    body('questionId')
      .notEmpty().withMessage('Question ID is required')
      .isMongoId().withMessage('Invalid question ID'),
    body('userAnswer')
      .notEmpty().withMessage('Answer is required'),
    validate
  ]
};

// Note validation rules
const noteValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title too long'),
    body('category')
      .notEmpty().withMessage('Category is required'),
    body('semester')
      .optional()
      .isInt({ min: 1, max: 8 }).withMessage('Invalid semester'),
    validate
  ]
};

// Video validation rules
const videoValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title too long'),
    body('url')
      .notEmpty().withMessage('URL is required')
      .isURL().withMessage('Invalid URL'),
    body('category')
      .notEmpty().withMessage('Category is required'),
    validate
  ]
};

// ID parameter validation
const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate
];

module.exports = {
  validate,
  authValidation,
  questionValidation,
  noteValidation,
  videoValidation,
  idValidation
};
