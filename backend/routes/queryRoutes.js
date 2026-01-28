import express from 'express';
import { body } from 'express-validator';
import {
    createQuery,
    getQueries,
    getQuery,
    updateQuery,
    deleteQuery,
    getQueryStats
} from '../controllers/queryController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const queryValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phone').optional().trim(),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
];

// Public routes
router.post('/', queryValidation, validate, createQuery);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getQueries);
router.get('/stats/overview', getQueryStats);
router.get('/:id', getQuery);
router.put('/:id', updateQuery);
router.delete('/:id', deleteQuery);

export default router;
