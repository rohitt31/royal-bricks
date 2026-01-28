import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (adminExists) {
            console.log('⚠️  Admin user already exists');
            console.log(`📧 Email: ${adminExists.email}`);
            console.log(`👤 Name: ${adminExists.fullName}`);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            email: process.env.ADMIN_EMAIL || 'admin@royalbricks.com',
            password: process.env.ADMIN_PASSWORD || 'Admin@123456',
            fullName: 'Royal Bricks Admin',
            phone: '+91 8298344803',
            role: 'admin',
            isActive: true
        });

        console.log('\n✅ Admin user created successfully!\n');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password:', process.env.ADMIN_PASSWORD || 'Admin@123456');
        console.log('👤 Name:', admin.fullName);
        console.log('🎭 Role:', admin.role);
        console.log('\n⚠️  IMPORTANT: Please change the password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
