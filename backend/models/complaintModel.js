const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: String,
        required: true,
        enum: ['Road', 'Water', 'Electricity', 'Sanitation', 'Other']
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true,
            default: 0
        },
        longitude: {
            type: Number,
            required: true,
            default: 0
        }
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    adminComment: {
        type: String,
        default: ''
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
