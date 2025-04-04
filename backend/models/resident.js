const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    suffix: { type: String },
    birthdate: { type: Date, required: true },
    age: { type: Number, required: true},
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    marital_status: { type: String, enum: ["Single", "Married", "Widowed", "Divorced"], required: true },
    nationality: { type: String, default: "Filipino" },

    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },

    address: {
        house_number: { type: String, required: true },
        street: { type: String, required: true },
        barangay: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        zip_code: { type: String }
    },

    medical_info: {
        blood_type: { type: String, enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] },
        medical_conditions: { type: [String], default: [] },
        disabilities: { type: [String], default: [] },
        emergency_contact: {
            name: { type: String, required: true },
            relationship: { type: String, required: true },
            phone: { type: String, required: true }
        }
    },

    employment: {
        occupation: { type: String },
        employer: { type: String },
        income_range: { type: String }
    },

    education: {
        highest_education: { type: String },
        field_of_study: { type: String }
    },

    registration: {
        resident_type: { type: String, enum: ["Permanent", "Temporary"], required: true },
        date_registered: { type: Date, default: Date.now },
        status: { type: String, enum: ["active", "inactive"], default: "active" }
    }
});

module.exports = mongoose.model("Resident", ResidentSchema);