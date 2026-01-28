import Booking from '../models/Booking.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
    try {
        const booking = await Booking.create({
            ...req.body,
            createdBy: req.user?.id
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all bookings with filters
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
    try {
        const {
            status,
            brickType,
            area,
            city,
            fromDate,
            toDate,
            search,
            page = 1,
            limit = 20,
            sortBy = '-createdAt'
        } = req.query;

        // Build query
        const query = {};

        if (status) query.status = status;
        if (brickType) query.brickType = brickType;
        if (area) query.area = new RegExp(area, 'i');
        if (city) query.city = new RegExp(city, 'i');

        // Date range filter
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }

        // Search filter
        if (search) {
            query.$or = [
                { bookingNumber: new RegExp(search, 'i') },
                { customerName: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;

        const bookings = await Booking.find(query)
            .sort(sortBy)
            .limit(parseInt(limit))
            .skip(skip)
            .populate('createdBy', 'fullName email');

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                bookings,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private/Admin
export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('createdBy', 'fullName email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats/overview
// @access  Private/Admin
export const getBookingStats = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        const dateFilter = {};
        if (fromDate || toDate) {
            dateFilter.createdAt = {};
            if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
            if (toDate) dateFilter.createdAt.$lte = new Date(toDate);
        }

        // Overall statistics
        const totalBookings = await Booking.countDocuments(dateFilter);
        const totalRevenue = await Booking.aggregate([
            { $match: dateFilter },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Status breakdown
        const statusBreakdown = await Booking.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Brick type breakdown
        const brickTypeBreakdown = await Booking.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$brickType',
                    count: { $sum: 1 },
                    quantity: { $sum: '$quantity' },
                    revenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        // Area-wise breakdown (Top 10 areas)
        const areaBreakdown = await Booking.aggregate([
            { $match: { ...dateFilter, area: { $exists: true, $ne: null, $ne: '' } } },
            {
                $group: {
                    _id: '$area',
                    count: { $sum: 1 },
                    quantity: { $sum: '$quantity' },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 }
        ]);

        // City-wise breakdown
        const cityBreakdown = await Booking.aggregate([
            { $match: { ...dateFilter, city: { $exists: true, $ne: null, $ne: '' } } },
            {
                $group: {
                    _id: '$city',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 }
        ]);

        // Monthly trend (last 12 months)
        const monthlyTrend = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                    quantity: { $sum: '$quantity' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Payment statistics
        const paymentStats = await Booking.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$paymentStatus',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                    paidAmount: { $sum: '$paidAmount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalBookings,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    averageOrderValue: totalBookings > 0 ? (totalRevenue[0]?.total || 0) / totalBookings : 0
                },
                statusBreakdown,
                brickTypeBreakdown,
                areaBreakdown,
                cityBreakdown,
                monthlyTrend,
                paymentStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get revenue by area
// @route   GET /api/bookings/stats/revenue-by-area
// @access  Private/Admin
export const getRevenueByArea = async (req, res) => {
    try {
        const { fromDate, toDate, limit = 20 } = req.query;

        const dateFilter = {};
        if (fromDate || toDate) {
            dateFilter.createdAt = {};
            if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
            if (toDate) dateFilter.createdAt.$lte = new Date(toDate);
        }

        const revenueByArea = await Booking.aggregate([
            { $match: { ...dateFilter, area: { $exists: true, $ne: null, $ne: '' } } },
            {
                $group: {
                    _id: '$area',
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.status(200).json({
            success: true,
            data: { revenueByArea }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
