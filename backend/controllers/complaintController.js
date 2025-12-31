const Complaint = require('../models/complaintModel');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper to upload to Cloudinary from buffer
const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: "village_reports" },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    const { category, description, latitude, longitude } = req.body;

    if (!category || !description || !latitude || !longitude) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if image is uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
    }

    try {
        // Upload image to Cloudinary
        const result = await uploadFromBuffer(req.file.buffer);

        const complaint = await Complaint.create({
            user: req.user.id,
            category,
            description,
            image: result.secure_url,
            location: {
                latitude,
                longitude
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

        const updatedComplaint = await complaint.save();
        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus
};
