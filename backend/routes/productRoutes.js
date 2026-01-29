import express from 'express';
import { body } from 'express-validator';
import {
    getProducts,
    getProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    toggleProductActive
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const productValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Product name must be between 3 and 100 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters'),
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['bricks', 'construction-materials', 'cement', 'sand', 'aggregates', 'other'])
        .withMessage('Invalid category'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('unit')
        .notEmpty()
        .withMessage('Unit is required')
        .isIn(['piece', 'kg', 'ton', 'bag', 'cubic-meter', 'square-feet'])
        .withMessage('Invalid unit'),
    body('minOrderQuantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Minimum order quantity must be at least 1')
];

// Public routes
router.get('/', getProducts);
router.get('/stats/categories', getCategories);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);

// Protected admin routes
router.post('/', protect, adminOnly, productValidation, createProduct);
router.put('/:id', protect, adminOnly, productValidation, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/toggle-active', protect, adminOnly, toggleProductActive);

export default router;
