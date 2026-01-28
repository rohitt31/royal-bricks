// Test script to create bookings directly in MongoDB
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const testBookings = [
    {
        customerName: "Rajesh Kumar",
        phone: "+91 9876543210",
        email: "rajesh.kumar@example.com",
        brickType: "first-class",
        quantity: 5000,
        deliveryAddress: "Plot No 45, Kankarbagh Main Road, Near SBI Bank",
        area: "Kankarbagh",
        city: "Patna",
        state: "Bihar",
        pincode: "800020",
        totalAmount: 50000,
        specialInstructions: "Please deliver between 9 AM to 5 PM"
    },
    {
        customerName: "Priya Sharma",
        phone: "+91 8765432109",
        email: "priya.sharma@gmail.com",
        brickType: "second-class",
        quantity: 10000,
        deliveryAddress: "House No 23, Boring Road, Opposite Patna College",
        area: "Boring Road",
        city: "Patna",
        state: "Bihar",
        pincode: "800001",
        totalAmount: 80000,
        specialInstructions: "Need urgent delivery"
    },
    {
        customerName: "Amit Singh",
        phone: "+91 7654321098",
        brickType: "fly-ash",
        quantity: 15000,
        deliveryAddress: "Sector 5, Kankarbagh Colony, Near Water Tank",
        area: "Kankarbagh",
        city: "Patna",
        state: "Bihar",
        pincode: "800020",
        totalAmount: 105000
    },
    {
        customerName: "Sunita Devi",
        phone: "+91 9988776655",
        email: "sunita.devi@yahoo.com",
        brickType: "first-class",
        quantity: 8000,
        deliveryAddress: "Gandhi Maidan Road, Near Collectorate",
        area: "Gandhi Maidan",
        city: "Patna",
        state: "Bihar",
        pincode: "800004",
        totalAmount: 80000
    },
    {
        customerName: "Vikram Jha",
        phone: "+91 8877665544",
        brickType: "second-class",
        quantity: 12000,
        deliveryAddress: "Patna University Campus, Ashok Rajpath",
        area: "Ashok Rajpath",
        city: "Patna",
        state: "Bihar",
        pincode: "800005",
        totalAmount: 96000,
        specialInstructions: "Contact before delivery"
    }
];

async function createTestBookings() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing bookings (optional - comment out if you want to keep existing data)
        // await Booking.deleteMany({});
        // console.log('🗑️  Cleared existing bookings');

        // Create test bookings
        console.log('\n📝 Creating test bookings...\n');

        for (const bookingData of testBookings) {
            const booking = await Booking.create(bookingData);
            console.log(`✅ Created: ${booking.bookingNumber} - ${booking.customerName} (₹${booking.totalAmount.toLocaleString()})`);
        }

        console.log(`\n🎉 Successfully created ${testBookings.length} test bookings!`);

        // Display summary
        const total = await Booking.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        console.log('\n📊 Summary:');
        console.log(`Total Bookings: ${total}`);
        console.log(`Total Revenue: ₹${(totalRevenue[0]?.total || 0).toLocaleString()}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createTestBookings();
