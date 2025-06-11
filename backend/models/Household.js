const mongoose = require('mongoose');

const HouseholdSchema = new mongoose.Schema({
    householdId: {
        type: String,
        unique: true,
        required: true
    },
    region: { type: String, required: true },
    province: { type: String, required: true },
    cityMunicipality: { type: String, required: true },
    barangay: { type: String, required: true },
    householdAddress: { type: String, required: true },
    headMemberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    },
    memberCount: { type: Number, default: 0 },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// Generate household ID before validation
HouseholdSchema.pre('validate', async function(next) {
    if (!this.householdId) {
        const count = await mongoose.model('Household').countDocuments();
        this.householdId = `HH-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Household', HouseholdSchema);
