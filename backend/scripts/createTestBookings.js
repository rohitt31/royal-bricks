import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';

dotenv.config();

// Helper to get random item from array
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate random date within last 30 days
const randomDate = () => {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const areas = ["Kankarbagh", "Boring Road", "Patliputra", "Danapur", "Phulwari Sharif", "Gandhi Maidan"];
const statuses = ['pending', 'confirmed', 'in_production', 'ready', 'delivered'];

const customers = [
    { name: "Rajesh Kumar", phone: "+91 9876543210", email: "rajesh@example.com" },
    { name: "Priya Sharma", phone: "+91 8765432109", email: "priya@example.com" },
    { name: "Amit Singh", phone: "+91 7654321098", email: "amit@example.com" },
    { name: "Sunita Devi", phone: "+91 9988776655", email: "sunita@example.com" },
    { name: "Vikram Jha", phone: "+91 8877665544", email: "vikram@example.com" },
    { name: "Suresh Patel", phone: "+91 7766554433", email: "suresh@example.com" }
];

async function createRealtimeBookings() {
    try {
        await connectDB();

        // 1. Get Admin User
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            throw new Error('No admin user found. Please run seedAdmin.js first.');
        }

        // 2. Get Real Products
        const products = await Product.find({});
        if (products.length === 0) {
            throw new Error('No products found. Please run seedProducts.js first.');
        }

        console.log(`✅ Loaded ${products.length} real products`);

        // 3. Clear existing bookings
        await Booking.deleteMany({});
        console.log('🗑️  Cleared existing bookings');

        // 4. Create New Dynamic Bookings
        const bookings = [];
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        for (let i = 0; i < 15; i++) {
            const customer = random(customers);
            const product = random(products);
            const area = random(areas);
            const quantity = product.unit === 'bag' ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 5000) + 1000;
            const totalAmount = quantity * product.price;
            const status = random(statuses);

            // Payment logic based on status
            let paymentStatus = 'pending';
            let paidAmount = 0;
            if (status === 'delivered') {
                paymentStatus = 'paid';
                paidAmount = totalAmount;
            } else if (status === 'confirmed' || status === 'in_production') {
                paymentStatus = 'partial';
                paidAmount = Math.floor(totalAmount * 0.3); // 30% advance
            }

            bookings.push({
                bookingNumber: `RB${year}${month}${(i + 1).toString().padStart(4, '0')}`,
                customerName: customer.name,
                phone: customer.phone,
                email: customer.email,
                brickType: product.slug, // Use real product slug
                quantity: quantity,
                deliveryAddress: `House No ${Math.floor(Math.random() * 100)}, ${area}, Patna`,
                area: area,
                city: "Patna",
                state: "Bihar",
                pincode: "800001",
                totalAmount: totalAmount,
                status: status,
                paymentStatus: paymentStatus,
                paidAmount: paidAmount,
                createdAt: randomDate(),
                createdBy: admin._id // Link to real admin
            });
        }

        const createdBookings = await Booking.insertMany(bookings);
        console.log(`\n🎉 Successfully created ${createdBookings.length} bookings using REAL product data!`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createRealtimeBookings();
