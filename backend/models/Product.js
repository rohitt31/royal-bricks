import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['bricks', 'construction-materials', 'cement', 'sand', 'aggregates', 'other'],
        default: 'bricks'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        default: 'piece',
        enum: ['piece', 'kg', 'ton', 'bag', 'cubic-meter', 'square-feet']
    },
    minOrderQuantity: {
        type: Number,
        default: 1,
        min: 1
    },
    images: [{
        url: String,
        alt: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    specifications: [{
        key: String,
        value: String
    }],
    features: [String],
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    tags: [String],
    seoTitle: String,
    seoDescription: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Generate slug from name before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Indexes

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isActive: 1, displayOrder: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
