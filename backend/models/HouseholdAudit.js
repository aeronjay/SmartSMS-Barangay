const mongoose = require('mongoose');

const HouseholdAuditSchema = new mongoose.Schema({
    householdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true
    },
    action: {
        type: String,
        enum: ['created', 'updated', 'member_added', 'member_removed', 'head_changed', 'deleted'],
        required: true
    },    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    changes: { type: Object }, // Store what changed
    previousData: { type: Object }, // Store previous state
    newData: { type: Object }, // Store new state
    memberDetails: { // For member-related actions
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
        memberName: { type: String },
        actionType: { type: String } // 'added', 'removed', 'made_head'
    },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('HouseholdAudit', HouseholdAuditSchema);
