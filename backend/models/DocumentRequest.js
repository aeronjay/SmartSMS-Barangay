const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    purpose: {
      type: String,
      required: true,
      trim: true
    },
    documentType: {
      type: String,
      required: true,
      trim: true
    },    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvalDetails: {
      pickupDate: String,
      pickupTime: String,
      officeHours: String,
      instructions: String
    },
    rejectionReason: {
      type: String,
      trim: true
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

const Request = mongoose.model('DocumentSchema', DocumentSchema);

module.exports = Request;