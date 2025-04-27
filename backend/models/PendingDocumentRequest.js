const mongoose = require('mongoose');

const PendingDocumentRequestSchema = new mongoose.Schema({
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
    },
    verificationCode: {
      type: String,
      required: true
    },
    codeExpiresAt: {
      type: Date,
      required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const PendingDocumentRequest = mongoose.model('PendingDocumentRequest', PendingDocumentRequestSchema);

module.exports = PendingDocumentRequest;
