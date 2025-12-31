const Complaint = require('../models/complaintModel');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper to get signature for client-side upload
const getUploadSignature = async (req, res) => {
    try {
        const timestamp = Math.round((new Date).getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            folder: 'village_reports'
        }, process.env.CLOUDINARY_API_SECRET);

        res.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        });
    } catch (error) {
        console.error('Signature generation error:', error);
        res.status(500).json({ message: 'Could not generate upload signature' });
    }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    // backend expects 'address', but frontend might send 'address' or 'locationText'
    const { category, description, latitude, longitude, address, locationText, image } = req.body; // image is now a URL string

    // Prefer 'address', fallback to 'locationText'
    const finalAddress = address || locationText;

    if (!category || !description || !finalAddress || !image) {
        return res.status(400).json({ message: 'Please add all fields including image URL' });
    }

    try {
        const complaint = await Complaint.create({
            user: req.user.id,
            category,
            description,
            image, // URL from frontend
            address: finalAddress,
            location: {
                latitude: latitude || 0,
                longitude: longitude || 0
            }
        });

        res.status(201).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user complaints
// @route   GET /api/complaints/my
// @access  Private
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all complaints (Admin)
// @route   GET /api/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).populate('user', 'name mobile').sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = req.body.status || complaint.status;
        complaint.adminComment = req.body.adminComment || complaint.adminComment;

        // Handle approval toggle if provided
        if (req.body.isApproved !== undefined) {
            complaint.isApproved = req.body.isApproved;
        }

        const updatedComplaint = await complaint.save();
        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Feed (Public)
// @route   GET /api/complaints/feed
// @access  Public
const getPublicFeed = async (req, res) => {
    try {
        const complaints = await Complaint.find({ isApproved: true }) // Only show approved complaints
            .select('category description image address status createdAt')
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus,
    getPublicFeed,
    getUploadSignature
};
