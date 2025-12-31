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
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    adminComment: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
