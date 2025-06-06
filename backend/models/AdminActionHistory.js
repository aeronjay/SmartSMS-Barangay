const mongoose = require('mongoose');

const AdminActionHistorySchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    adminUsername: { type: String, required: true },
    action: { type: String, required: true }, // e.g., 'approved request', 'rejected request'
    target: { type: String }, // e.g., request id or description
    details: { type: Object }, // optional: extra info
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminActionHistory', AdminActionHistorySchema);