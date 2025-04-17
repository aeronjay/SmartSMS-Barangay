const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    phoneNumbers: {
        type: [String],
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one phone number is required',
        },
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    messageId: {
        type: String,
        required: false, // May not be available immediately
        default: null,
    },
    createdBy: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Sent', 'Delivered', 'Failed', 'Unknown'],
        default: 'Pending',
    },
    error: {
        type: String,
        required: false,
        default: null,
    },
    createdAt: {
        type: Date,
        default: () => {
            // Generate the current date in Philippine Time (UTC+8)
            const now = new Date();
            const offset = 8 * 60; // UTC+8 offset in minutes
            return new Date(now.getTime() + offset * 60 * 1000);
        },
    },
});

const History = mongoose.model('History', historySchema);

module.exports = History;