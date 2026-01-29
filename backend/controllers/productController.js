import Product from '../models/Product.js';
import { validationResult } from 'express-validator';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const {
            category,
            inStock,
            isActive,
            search,
            page = 1,
            limit = 20,
            sortBy = '-createdAt'
        } = req.query;

        const query = {};

        // Filters
        if (category) query.category = category;
        if (inStock !== undefined) query.inStock = inStock === 'true';
        if (isActive !== undefined) query.isActive = isActive === 'true';

        // Search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email');

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product by slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const productData = {
            ...req.body,
            createdBy: req.user._id,
            updatedBy: req.user._id
        };

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Product with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user._id
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Product with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};

// @desc    Get product categories
// @route   GET /api/products/stats/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

// @desc    Toggle product active status
// @route   PATCH /api/products/:id/toggle-active
// @access  Private/Admin
export const toggleProductActive = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product.isActive = !product.isActive;
        product.updatedBy = req.user._id;
        await product.save();

        res.status(200).json({
            success: true,
            message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
            data: product
        });
    } catch (error) {
        console.error('Toggle product active error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle product status',
            error: error.message
        });
    }
};
