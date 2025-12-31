const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .post(protect, upload.single('image'), createComplaint)
    .get(protect, admin, getAllComplaints);

router.route('/my').get(protect, getMyComplaints);

router.route('/:id').put(protect, admin, updateComplaintStatus);

module.exports = router;
