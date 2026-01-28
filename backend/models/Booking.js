import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    bookingNumber: {
        type: String,
        unique: true,
        index: true
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    brickType: {
        type: String,
        required: [true, 'Brick type is required'],
        enum: ['first-class', 'second-class', 'fly-ash']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1000, 'Minimum order is 1000 bricks']
    },
    deliveryAddress: {
        type: String,
        required: [true, 'Delivery address is required']
    },
    area: {
        type: String,
        trim: true,
        index: true // For analytics by area
    },
    city: {
        type: String,
        trim: true,
        index: true
    },
    state: {
        type: String,
        trim: true,
        default: 'Bihar'
    },
    pincode: {
        type: String,
        trim: true
    },
    deliveryDate: {
        type: Date
    },
    specialInstructions: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_production', 'ready', 'delivered', 'cancelled'],
        default: 'pending',
        index: true
    },
    totalAmount: {
        type: Number,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'paid'],
        default: 'pending'
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    adminNotes: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Generate booking number before saving
bookingSchema.pre('save', async function (next) {
    if (!this.bookingNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await mongoose.model('Booking').countDocuments();
        this.bookingNumber = `RB${year}${month}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

// Indexes for analytics
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ area: 1, createdAt: -1 });
bookingSchema.index({ brickType: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
