import ContactQuery from '../models/ContactQuery.js';

// @desc    Create new contact query
// @route   POST /api/queries
// @access  Public
export const createQuery = async (req, res) => {
    try {
        const query = await ContactQuery.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Query submitted successfully',
            data: { query }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all queries with filters
// @route   GET /api/queries
// @access  Private/Admin
export const getQueries = async (req, res) => {
    try {
        const {
            status,
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

        // Date range filter
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { subject: new RegExp(search, 'i') },
                { message: new RegExp(search, 'i') }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;

        const queries = await ContactQuery.find(query)
            .sort(sortBy)
            .limit(parseInt(limit))
            .skip(skip)
            .populate('assignedTo', 'fullName email');

        const total = await ContactQuery.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                queries,
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

// @desc    Get single query
// @route   GET /api/queries/:id
// @access  Private/Admin
export const getQuery = async (req, res) => {
    try {
        const query = await ContactQuery.findById(req.params.id)
            .populate('assignedTo', 'fullName email');

        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'Query not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { query }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update query
// @route   PUT /api/queries/:id
// @access  Private/Admin
export const updateQuery = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If status is being changed to resolved, set resolvedAt
        if (updateData.status === 'resolved') {
            updateData.resolvedAt = new Date();
        }

        const query = await ContactQuery.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'Query not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Query updated successfully',
            data: { query }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete query
// @route   DELETE /api/queries/:id
// @access  Private/Admin
export const deleteQuery = async (req, res) => {
    try {
        const query = await ContactQuery.findByIdAndDelete(req.params.id);

        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'Query not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Query deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get query statistics
// @route   GET /api/queries/stats/overview
// @access  Private/Admin
export const getQueryStats = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        const dateFilter = {};
        if (fromDate || toDate) {
            dateFilter.createdAt = {};
            if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
            if (toDate) dateFilter.createdAt.$lte = new Date(toDate);
        }

        // Overall statistics
        const totalQueries = await ContactQuery.countDocuments(dateFilter);

        // Status breakdown
        const statusBreakdown = await ContactQuery.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Average resolution time
        const resolutionTime = await ContactQuery.aggregate([
            {
                $match: {
                    ...dateFilter,
                    status: 'resolved',
                    resolvedAt: { $exists: true }
                }
            },
            {
                $project: {
                    resolutionTime: {
                        $subtract: ['$resolvedAt', '$createdAt']
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgResolutionTime: { $avg: '$resolutionTime' }
                }
            }
        ]);

        // Daily trend (last 30 days)
        const dailyTrend = await ContactQuery.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalQueries,
                    averageResolutionTime: resolutionTime[0]?.avgResolutionTime || 0
                },
                statusBreakdown,
                dailyTrend
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
