const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus,
    getPublicFeed,
    getUploadSignature
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/feed', getPublicFeed);

router.get('/upload-signature', protect, getUploadSignature);

router.route('/')
    .post(protect, createComplaint) // Removed upload.single('image')
    .get(protect, admin, getAllComplaints);

router.route('/my').get(protect, getMyComplaints);

router.route('/:id').put(protect, admin, updateComplaintStatus);

module.exports = router;
