import express from 'express';
import { body } from 'express-validator';
import {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    deleteBooking,
    getBookingStats,
    getRevenueByArea
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const bookingValidation = [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('brickType')
        .isIn(['first-class', 'second-class', 'fly-ash'])
        .withMessage('Invalid brick type'),
    body('quantity')
        .isInt({ min: 1000 })
        .withMessage('Minimum order quantity is 1000 bricks'),
    body('deliveryAddress').trim().notEmpty().withMessage('Delivery address is required'),
    body('area').optional().trim(),
    body('city').optional().trim(),
    body('state').optional().trim(),
    body('pincode').optional().trim(),
    body('specialInstructions').optional().trim()
];

// Public routes
router.post('/', bookingValidation, validate, createBooking);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getBookings);
router.get('/stats/overview', getBookingStats);
router.get('/stats/revenue-by-area', getRevenueByArea);
router.get('/:id', getBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
