import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const products = [
    {
        name: 'First Class Red Brick',
        slug: 'first-class-red-brick',
        description: 'High quality first class red bricks for superior construction.',
        category: 'bricks',
        price: 12.50,
        unit: 'piece',
        minOrderQuantity: 1000,
        inStock: true,
        stockQuantity: 50000,
        isActive: true,
        features: ['Uniform Shape', 'High Strength', 'Rich Color'],
        specifications: [
            { key: 'Size', value: '9x4x3 inch' },
            { key: 'Weight', value: '3.5 kg' }
        ],
        images: [
            { url: 'https://images.unsplash.com/photo-1590059590928-1fc47c177570?q=80&w=600&auto=format&fit=crop', alt: 'Red Brick', isPrimary: true }
        ]
    },
    {
        name: 'Fly Ash Brick',
        slug: 'fly-ash-brick',
        description: 'Eco-friendly fly ash bricks with excellent durability.',
        category: 'bricks',
        price: 8.00,
        unit: 'piece',
        minOrderQuantity: 1000,
        inStock: true,
        stockQuantity: 100000,
        isActive: true,
        features: ['Eco Friendly', 'Light Weight', 'Cost Effective'],
        specifications: [
            { key: 'Size', value: '9x4x3 inch' },
            { key: 'Compressive Strength', value: '10 N/mm2' }
        ],
        images: [
            { url: 'https://images.unsplash.com/photo-1628108428568-1bc2d69f06df?q=80&w=600&auto=format&fit=crop', alt: 'Fly Ash Brick', isPrimary: true }
        ]
    },
    {
        name: 'Cement Bag (50kg)',
        slug: 'cement-bag-50kg',
        description: 'Premium grade cement for strong foundations.',
        category: 'cement',
        price: 450.00,
        unit: 'bag',
        minOrderQuantity: 50,
        inStock: true,
        stockQuantity: 500,
        isActive: true,
        features: ['Fast Setting', 'High Strength'],
        specifications: [
            { key: 'Grade', value: 'OPC 53' },
            { key: 'Weight', value: '50 kg' }
        ],
        images: [
            { url: 'https://images.unsplash.com/photo-1565514020176-7953265eb457?q=80&w=600&auto=format&fit=crop', alt: 'Cement Bag', isPrimary: true }
        ]
    }
];

const seedProducts = async () => {
    try {
        await connectDB();

        // Get admin user
        const admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            console.error('❌ Admin user not found. Run seedAdmin.js first.');
            process.exit(1);
        }

        // Clear existing products
        await Product.deleteMany();
        console.log('🗑️  Cleared existing products');

        // Add admin ID to products
        const productsWithUser = products.map(product => ({
            ...product,
            createdBy: admin._id,
            updatedBy: admin._id
        }));

        // Insert new products
        await Product.insertMany(productsWithUser);
        console.log('✅ Products seeded successfully');

        process.exit(0);
    } catch (error) {
        console.error(`❌ Error seeding products: ${error.message}`);
        process.exit(1);
    }
};

seedProducts();
