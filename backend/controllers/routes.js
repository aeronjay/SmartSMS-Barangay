const routes = require('express').Router()
const User = require('../models/User')
const Resident = require('../models/resident')
const History = require('../models/History')
const Request = require('../models/DocumentRequest')
const BroadcastTemplate = require('../models/BroadcastTemplate');
const PendingDocumentRequest = require('../models/PendingDocumentRequest');
const nodemailer = require('nodemailer');
require('dotenv').config();

const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

// const { body, param, validationResult } = require('express-validator');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ error: "access denied" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "access denied" });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};
routes.get('/api/admin/verify-token', authMiddleware, (req, res) => {
    // If the request gets this far, it means the authMiddleware has verified the token
    res.status(200).json({ valid: true });
});

const requireRole = (role) => (req, res, next) => {
    if (!req.user || !req.user.userId) return res.status(401).json({ error: 'Unauthorized' });
    User.findById(req.user.userId).then(user => {
        if (!user || user.role !== role) {
            return res.status(403).json({ error: 'Forbidden: Insufficient role' });
        }
        next();
    }).catch(() => res.status(500).json({ error: 'Server error' }));
};


routes.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const currentUser = await User.findOne({ username })

        if (!currentUser) return res.status(400).json({ error: "USER NOT FOUND" })

        const isMatch = await bcrypt.compare(password, currentUser.password);
        if (!isMatch) return res.status(400).json({ error: 'INVALID CREDS!' })

        // Include role, fullname, and username in JWT and response
        const token = jwt.sign({ 
            userId: currentUser._id, 
            role: currentUser.role, 
            fullname: currentUser.fullname, 
            username: currentUser.username 
        }, process.env.SECRET_KEY, {
            expiresIn: "8h",
        });

        res.json({ token, role: currentUser.role, username: currentUser.username, fullname: currentUser.fullname })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})


routes.delete('/api/resident/delete/:id', authMiddleware , requireRole('superadmin'), async (req, res) => {
    try {
        const residentId = req.params.id;

        // Check if resident exists
        const resident = await Resident.findById(residentId);
        if (!resident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        // Delete the resident
        await Resident.findByIdAndDelete(residentId);

        res.json({ message: 'Resident deleted successfully' });
    } catch (err) {
        console.error('Error deleting resident:', err);
        res.status(500).json({ message: err.message });
    }
})

routes.post('/api/resident/register', authMiddleware, async (req, res) => {
    try {
        const newResident = new Resident(req.body);
        await newResident.save();
        res.status(201).json(newResident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

routes.get('/api/resident/all', authMiddleware, async (req, res) => {
    try {
        const residents = await Resident.find();
        res.status(200).json(residents);
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})
routes.put('/api/resident/update/:id', authMiddleware, async (req, res) => {
    try {
        const residentId = req.params.id;
        const updatedData = req.body;

        const updatedResident = await Resident.findByIdAndUpdate(
            residentId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedResident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        res.status(200).json(updatedResident);
    } catch (error) {
        console.error('Error updating resident:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


routes.get('/api/history/getall', authMiddleware, async (req, res) => {
    try {
        const history = await History.find()
            .select('phoneNumbers message messageId status createdAt broadcastType') // Select only needed fields
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Req Documents 



// Helper to generate a 6-digit code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to send email
async function sendVerificationEmail(email, code) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your Document Request Verification Code',
        text: `Your verification code is: ${code}. It will expire in 10 minutes.`
    });
}

routes.post('/api/resident/documentRequest', async (req, res) => {
    try {
        const { email, phoneNumber, address, fullName, purpose, documentType } = req.body;
        const code = generateVerificationCode();
        const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Remove any previous pending requests for this email
        await PendingDocumentRequest.deleteMany({ email });

        // Store pending request
        const pending = new PendingDocumentRequest({
            email, phoneNumber, address, fullName, purpose, documentType,
            verificationCode: code,
            codeExpiresAt
        });
        await pending.save();

        // Send email
        await sendVerificationEmail(email, code);

        return res.status(200).json({
            message: 'Verification code sent to your email. Please verify to complete your request.'
        });
    } catch (error) {
        console.error('Error submitting document request:', error);
        return res.status(500).json({
            message: 'An error occurred while processing your request'
        });
    }
});

// New endpoint: verify code and finalize request
routes.post('/api/resident/verifyDocumentRequest', async (req, res) => {
    try {
        const { email, code } = req.body;
        const pending = await PendingDocumentRequest.findOne({ email });
        if (!pending)
            return res.status(400).json({ message: 'No pending request found for this email.' });
        if (pending.verificationCode !== code)
            return res.status(400).json({ message: 'Invalid verification code.' });
        if (pending.codeExpiresAt < new Date()) {
            await PendingDocumentRequest.deleteOne({ _id: pending._id });
            return res.status(400).json({ message: 'Verification code expired. Please request again.' });
        }
        // Move to DocumentRequest
        const newRequest = new Request({
            email: pending.email,
            phoneNumber: pending.phoneNumber,
            address: pending.address,
            fullName: pending.fullName,
            purpose: pending.purpose,
            documentType: pending.documentType
        });
        await newRequest.save();
        await PendingDocumentRequest.deleteOne({ _id: pending._id });
        return res.status(201).json({ message: 'Document request verified and submitted successfully.' });
    } catch (error) {
        console.error('Error verifying document request:', error);
        return res.status(500).json({ message: 'An error occurred during verification.' });
    }
});


routes.get('/api/admin/allrequest', authMiddleware, async (req, res) => {
    try {
        // Fetch all pending requests
        const pendingRequests = await Request.find({})
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        return res.status(200).json({
            count: pendingRequests.length,
            requests: pendingRequests
        });
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching pending requests'
        });
    }
});

// Route 2: Admin views pending requests
routes.get('/api/admin/pendingrequest', authMiddleware, async (req, res) => {
    try {
        // Fetch all pending requests
        const pendingRequests = await Request.find({ status: 'pending' })
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        return res.status(200).json({
            count: pendingRequests.length,
            requests: pendingRequests
        });
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching pending requests'
        });
    }
});

routes.put('/api/admin/updaterequests/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        // Find and update the document
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Document request not found' });
        }

        return res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
        console.error('Error updating document status:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

routes.delete('/api/templates/:id', authMiddleware, requireRole('superadmin'), async (req, res) => {
    try {
        const template = await BroadcastTemplate.findByIdAndDelete(req.params.id);
        if (!template) return res.status(404).json({ error: 'Template not found' });
        res.json({ message: 'Template deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Broadcast Template CRUD
routes.get('/api/templates', authMiddleware, async (req, res) => {
    try {
        const templates = await BroadcastTemplate.find().sort({ createdAt: -1 });
        res.json(templates);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});
routes.post('/api/templates', authMiddleware, async (req, res) => {
    try {
        const { title, message } = req.body;
        const template = new BroadcastTemplate({ title, message });
        await template.save();
        res.status(201).json(template);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
routes.put('/api/templates/:id', authMiddleware, async (req, res) => {
    try {
        const { title, message } = req.body;
        const template = await BroadcastTemplate.findByIdAndUpdate(
            req.params.id,
            { title, message },
            { new: true, runValidators: true }
        );
        if (!template) return res.status(404).json({ error: 'Template not found' });
        res.json(template);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// --- Admin Accounts CRUD (superadmin only) ---
// List all admins
routes.get('/api/admin/accounts', authMiddleware, requireRole('superadmin'), async (req, res) => {
    const admins = await User.find({}, '-password'); // Exclude password
    res.json(admins);
});
// Create admin
routes.post('/api/admin/accounts', authMiddleware, requireRole('superadmin'), async (req, res) => {
    try {
        const { username, password, fullname, phoneNumber } = req.body;
        if (!username || !password || !fullname || !phoneNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (await User.findOne({ username })) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await User.create({ username, password: hashedPassword, fullname, phoneNumber, role: 'admin' });
        res.status(201).json({ message: 'Admin created', admin: { ...newAdmin.toObject(), password: undefined } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Update admin
routes.put('/api/admin/accounts/:id', authMiddleware, requireRole('superadmin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, phoneNumber, password } = req.body;
        const admin = await User.findById(id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        if (admin.role === 'superadmin') return res.status(403).json({ error: 'Cannot update superadmin' });
        if (fullname) admin.fullname = fullname;
        if (phoneNumber) admin.phoneNumber = phoneNumber;
        if (password) admin.password = await bcrypt.hash(password, 10);
        await admin.save();
        res.json({ message: 'Admin updated', admin: { ...admin.toObject(), password: undefined } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Delete admin
routes.delete('/api/admin/accounts/:id', authMiddleware, requireRole('superadmin'), async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await User.findById(id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        if (admin.role === 'superadmin') return res.status(403).json({ error: 'Cannot delete superadmin' });
        await admin.deleteOne();
        res.json({ message: 'Admin deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = routes