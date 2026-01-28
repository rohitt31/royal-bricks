import mongoose from 'mongoose';

const contactQuerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'resolved'],
        default: 'new',
        index: true
    },
    adminNotes: {
        type: String
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
contactQuerySchema.index({ createdAt: -1 });
contactQuerySchema.index({ status: 1, createdAt: -1 });

const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);

export default ContactQuery;
