const routes = require('express').Router()
const Admin = require('../models/User')
const Resident = require('../models/resident')
const History = require('../models/History')
const Request = require('../models/DocumentRequest')
const BroadcastTemplate = require('../models/BroadcastTemplate');
const PendingDocumentRequest = require('../models/PendingDocumentRequest');
const AdminActionHistory = require('../models/AdminActionHistory');
const Household = require('../models/Household');
const HouseholdAudit = require('../models/HouseholdAudit');
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

const requireRole = (role) => (req, res, next) => {    if (!req.user || !req.user.userId) return res.status(401).json({ error: 'Unauthorized' });
    Admin.findById(req.user.userId).then(user => {
        if (!user || user.role !== role) {
            return res.status(403).json({ error: 'Forbidden: Insufficient role' });
        }
        next();
    }).catch(() => res.status(500).json({ error: 'Server error' }));
};


routes.post('/api/admin/login', async (req, res) => {
    try {        const { username, password } = req.body
        const currentUser = await Admin.findOne({ username })

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

        // Check if resident exists and get their info for logging
        const resident = await Resident.findById(residentId);
        if (!resident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        // Delete the resident
        await Resident.findByIdAndDelete(residentId);

        // Log admin action
        if (req.user && req.user.userId && req.user.username) {
            await AdminActionHistory.create({
                adminId: req.user.userId,
                adminUsername: req.user.username,
                action: 'deleted resident',
                target: residentId,
                details: {
                    residentId: residentId,
                    fullName: `${resident.first_name} ${resident.middle_name ? resident.middle_name + ' ' : ''}${resident.last_name} ${resident.suffix || ''}`.trim(),
                    phoneNumber: resident.contact?.phone || 'N/A'
                }
            });
        }

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

        // Log admin action
        if (req.user && req.user.userId && req.user.username) {
            await AdminActionHistory.create({
                adminId: req.user.userId,
                adminUsername: req.user.username,
                action: 'created resident',
                target: newResident._id,
                details: {
                    residentId: newResident._id,
                    fullName: `${newResident.first_name} ${newResident.middle_name ? newResident.middle_name + ' ' : ''}${newResident.last_name} ${newResident.suffix || ''}`.trim(),
                    phoneNumber: newResident.contact?.phone || 'N/A'
                }
            });
        }

        res.status(201).json(newResident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

routes.get('/api/resident/all', authMiddleware, async (req, res) => {
    try {
        const residents = await Resident.find().populate('householdId');
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

        // Get the existing resident first for logging
        const existingResident = await Resident.findById(residentId);
        if (!existingResident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        const updatedResident = await Resident.findByIdAndUpdate(
            residentId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        // Log admin action
        if (req.user && req.user.userId && req.user.username) {
            await AdminActionHistory.create({
                adminId: req.user.userId,
                adminUsername: req.user.username,
                action: 'updated resident',
                target: residentId,
                details: {
                    residentId: residentId,
                    fullName: `${updatedResident.first_name} ${updatedResident.middle_name ? updatedResident.middle_name + ' ' : ''}${updatedResident.last_name} ${updatedResident.suffix || ''}`.trim(),
                    phoneNumber: updatedResident.contact?.phone || 'N/A'
                }
            });
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

        // Log admin action
        if (req.user && req.user.userId && req.user.username) {
            await AdminActionHistory.create({
                adminId: req.user.userId,
                adminUsername: req.user.username,
                action: `${status} document request`,
                target: id,
                details: {
                    requestId: id,
                    status,
                    fullName: updatedRequest.fullName,
                    documentType: updatedRequest.documentType
                }
            });
        }

        return res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
        console.error('Error updating document status:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Endpoint for superadmin to fetch admin action history
routes.get('/api/admin/action-history', authMiddleware, requireRole('superadmin'), async (req, res) => {
    try {
        const history = await AdminActionHistory.find({})
            .sort({ createdAt: -1 })
            .limit(200);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admin action history' });
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
    const admins = await Admin.find({}, '-password'); // Exclude password
    res.json(admins);
});
// Create admin
routes.post('/api/admin/accounts', authMiddleware, requireRole('superadmin'), async (req, res) => {
    try {
        const { username, password, fullname, phoneNumber } = req.body;
        if (!username || !password || !fullname || !phoneNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }        if (await Admin.findOne({ username })) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({ username, password: hashedPassword, fullname, phoneNumber, role: 'admin' });

        // Log admin action
        if (req.user && req.user.userId && req.user.username) {
            await AdminActionHistory.create({
                adminId: req.user.userId,
                adminUsername: req.user.username,
                action: 'created admin account',
                target: newAdmin._id,
                details: {
                    adminId: newAdmin._id,
                    username: newAdmin.username,
                    fullName: newAdmin.fullname,
                    phoneNumber: newAdmin.phoneNumber,
                    role: newAdmin.role
                }
            });
        }

        res.status(201).json({ message: 'Admin created', admin: { ...newAdmin.toObject(), password: undefined } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Update admin
routes.put('/api/admin/accounts/:id', authMiddleware, requireRole('superadmin'), async (req, res) => {    try {
        const { id } = req.params;
        const { fullname, phoneNumber, password } = req.body;
        const admin = await Admin.findById(id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        if (admin.role === 'superadmin') return res.status(403).json({ error: 'Cannot update superadmin' });
        
        // Store original values for logging
        const originalValues = {
            fullname: admin.fullname,
            phoneNumber: admin.phoneNumber
        };
        
        if (fullname) admin.fullname = fullname;
        if (phoneNumber) admin.phoneNumber = phoneNumber;
        if (password) admin.password = await bcrypt.hash(password, 10);
        await admin.save();

        // Log admin action
        if (req.user && req.user.userId && req.user.username) {
            const changes = [];
            if (fullname && fullname !== originalValues.fullname) changes.push(`fullname: ${originalValues.fullname} → ${fullname}`);
            if (phoneNumber && phoneNumber !== originalValues.phoneNumber) changes.push(`phone: ${originalValues.phoneNumber} → ${phoneNumber}`);
            if (password) changes.push('password updated');

            await AdminActionHistory.create({
                adminId: req.user.userId,
                adminUsername: req.user.username,
                action: 'updated admin account',
                target: id,
                details: {
                    adminId: id,
                    username: admin.username,
                    fullName: admin.fullname,
                    phoneNumber: admin.phoneNumber,
                    changes: changes.join(', ')
                }
            });
        }

        res.json({ message: 'Admin updated', admin: { ...admin.toObject(), password: undefined } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Delete admin
routes.delete('/api/admin/accounts/:id', authMiddleware, requireRole('superadmin'), async (req, res) => {    try {
        const { id } = req.params;
        const admin = await Admin.findById(id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        if (admin.role === 'superadmin') return res.status(403).json({ error: 'Cannot delete superadmin' });
        
        // Store admin info for logging before deletion
        const adminInfo = {
            username: admin.username,
            fullname: admin.fullname,
            phoneNumber: admin.phoneNumber,
            role: admin.role
        };
        
        await admin.deleteOne();

        // Log admin action
        if (req.user && req.user.userId && req.user.username) {
            await AdminActionHistory.create({
                adminId: req.user.userId,
                adminUsername: req.user.username,
                action: 'deleted admin account',
                target: id,
                details: {
                    adminId: id,
                    username: adminInfo.username,
                    fullName: adminInfo.fullname,
                    phoneNumber: adminInfo.phoneNumber,
                    role: adminInfo.role
                }
            });
        }

        res.json({ message: 'Admin deleted' });
    } catch (err) {        res.status(500).json({ error: err.message });
    }
});

// ================================
// HOUSEHOLD MANAGEMENT ROUTES
// ================================

// Helper function to create audit log
const createHouseholdAudit = async (householdId, action, changedBy, changes = {}, memberDetails = null) => {
    try {
        const audit = new HouseholdAudit({
            householdId,
            action,
            changedBy,
            changes,
            memberDetails
        });
        await audit.save();
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};

// Get all households
routes.get('/api/households', authMiddleware, async (req, res) => {
    try {
        const households = await Household.find({ status: 'active' })
            .populate('headMemberId', 'first_name middle_name last_name')
            .populate('createdBy', 'username fullname')
            .sort({ dateCreated: -1 });
        
        res.json(households);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single household with members
routes.get('/api/households/:id', authMiddleware, async (req, res) => {
    try {
        const household = await Household.findById(req.params.id)
            .populate('headMemberId')
            .populate('createdBy', 'username fullname')
            .populate('updatedBy', 'username fullname');
        
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        const members = await Resident.find({ householdId: req.params.id });
        
        res.json({
            household,
            members
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get household with all member details for printing
routes.get('/api/households/:id/print', authMiddleware, async (req, res) => {
    try {
        const household = await Household.findById(req.params.id)
            .populate('headMemberId')
            .populate('createdBy', 'username fullname')
            .populate('updatedBy', 'username fullname');
        
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }        // Get all members with full details
        const members = await Resident.find({ householdId: req.params.id })
            .select('first_name last_name middle_name suffix birthdate placeOfBirth age gender marital_status citizenship employment.occupation contact.phone householdId isHouseholdHead')
            .sort({ isHouseholdHead: -1, first_name: 1 }); // Sort head first, then by name
        
        // Prepare data for printing
        const printData = {
            householdId: household.householdId,
            region: household.region,
            province: household.province,
            cityMunicipality: household.cityMunicipality,
            barangay: household.barangay,
            householdAddress: household.householdAddress,
            dateCreated: household.dateCreated,
            headMember: household.headMemberId,
            memberCount: household.memberCount,
            members: members
        };
        
        res.json(printData);
    } catch (error) {
        console.error('Error fetching household for print:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new household
routes.post('/api/households', authMiddleware, async (req, res) => {
    try {
        const { householdData, members } = req.body;
        
        // Validate head member is first in members array
        if (!members || members.length === 0) {
            return res.status(400).json({ message: 'At least one member (head) is required' });
        }

        if (members.length > 18) {
            return res.status(400).json({ message: 'Maximum 18 inhabitants allowed per household' });
        }

        // First, process the head member to get their ID
        let headMemberId = null;
        
        // Process the first member (head) first
        const headMemberData = {
            ...members[0],
            isHouseholdHead: true,
            householdAddress: householdData.householdAddress
        };
        
        if (members[0].isExisting) {
            // Update existing resident to be head
            await Resident.findByIdAndUpdate(members[0]._id, headMemberData);
            headMemberId = members[0]._id;
        } else {
            // Create new resident as head
            delete headMemberData._id; // Remove _id if it exists
            delete headMemberData.isExisting;
            const newHeadResident = new Resident(headMemberData);
            await newHeadResident.save();
            headMemberId = newHeadResident._id;
        }

        // Now create household with headMemberId
        const household = new Household({
            ...householdData,
            headMemberId: headMemberId,
            memberCount: members.length,
            createdBy: req.user.userId
        });

        await household.save();

        // Process remaining members (if any)
        for (let i = 1; i < members.length; i++) {
            const memberData = {
                ...members[i],
                householdId: household._id,
                isHouseholdHead: false,
                householdAddress: householdData.householdAddress
            };
            
            if (members[i].isExisting) {
                // Update existing resident
                await Resident.findByIdAndUpdate(members[i]._id, memberData);
            } else {
                // Create new resident
                delete memberData._id; // Remove _id if it exists
                delete memberData.isExisting;
                const newResident = new Resident(memberData);
                await newResident.save();
            }
        }

        // Update head member with household ID
        await Resident.findByIdAndUpdate(headMemberId, { householdId: household._id });

        // Create audit log
        await createHouseholdAudit(household._id, 'created', req.user.userId, {
            householdData,
            memberCount: members.length
        });

        const populatedHousehold = await Household.findById(household._id)
            .populate('headMemberId', 'first_name middle_name last_name')
            .populate('createdBy', 'username fullname');

        res.status(201).json(populatedHousehold);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update household
routes.put('/api/households/:id', authMiddleware, async (req, res) => {
    try {
        const { householdData } = req.body;
        
        const oldHousehold = await Household.findById(req.params.id);
        if (!oldHousehold) {
            return res.status(404).json({ error: 'Household not found' });
        }

        const updatedHousehold = await Household.findByIdAndUpdate(
            req.params.id,
            {
                ...householdData,
                updatedBy: req.user.userId,
                dateUpdated: new Date()
            },
            { new: true }
        ).populate('headMemberId', 'first_name middle_name last_name');

        // Update household address for all members if address changed
        if (oldHousehold.householdAddress !== householdData.householdAddress) {
            await Resident.updateMany(
                { householdId: req.params.id },
                { householdAddress: householdData.householdAddress }
            );
        }

        // Create audit log
        await createHouseholdAudit(req.params.id, 'updated', req.user.userId, {
            oldData: oldHousehold.toObject(),
            newData: householdData
        });

        res.json(updatedHousehold);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add member to household
routes.post('/api/households/:id/members', authMiddleware, async (req, res) => {
    try {
        const { memberData, isExisting } = req.body;
        const householdId = req.params.id;

        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        if (household.memberCount >= 18) {
            return res.status(400).json({ message: 'Maximum 18 inhabitants allowed per household' });
        }

        let member;
        
        if (isExisting) {
            // Update existing resident
            member = await Resident.findByIdAndUpdate(memberData._id, {
                ...memberData,
                householdId: householdId,
                householdAddress: household.householdAddress,
                isHouseholdHead: false
            }, { new: true });
        } else {
            // Create new resident
            member = new Resident({
                ...memberData,
                householdId: householdId,
                householdAddress: household.householdAddress,
                isHouseholdHead: false
            });
            await member.save();
        }

        // Update household member count
        household.memberCount += 1;
        household.updatedBy = req.user.userId;
        household.dateUpdated = new Date();
        await household.save();

        // Create audit log
        await createHouseholdAudit(householdId, 'member_added', req.user.userId, {}, {
            memberId: member._id,
            memberName: `${member.first_name} ${member.last_name}`,
            actionType: 'added'
        });

        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove member from household
routes.delete('/api/households/:householdId/members/:memberId', authMiddleware, async (req, res) => {
    try {
        const { householdId, memberId } = req.params;
        const { action } = req.query; // 'unassign' or 'delete'

        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        const member = await Resident.findById(memberId);
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // Check if member is household head
        if (member.isHouseholdHead && household.memberCount > 1) {
            return res.status(400).json({ 
                error: 'Cannot remove household head. Please assign a new head first.' 
            });
        }

        let auditAction = '';
        let memberName = `${member.first_name} ${member.last_name}`;

        if (action === 'delete') {
            // Delete resident entirely
            await Resident.findByIdAndDelete(memberId);
            auditAction = 'member_removed';
        } else {
            // Unassign from household
            await Resident.findByIdAndUpdate(memberId, {
                householdId: null,
                isHouseholdHead: false,
                householdAddress: null
            });
            auditAction = 'member_removed';
        }

        // Update household
        household.memberCount -= 1;
        household.updatedBy = req.user.userId;
        household.dateUpdated = new Date();

        // If this was the last member, we might want to handle household deletion
        if (household.memberCount === 0) {
            household.status = 'inactive';
        }

        await household.save();

        // Create audit log
        await createHouseholdAudit(householdId, auditAction, req.user.userId, { action }, {
            memberId: memberId,
            memberName: memberName,
            actionType: action === 'delete' ? 'deleted' : 'unassigned'
        });

        res.json({ message: `Member ${action === 'delete' ? 'deleted' : 'unassigned'} successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change household head
routes.put('/api/households/:householdId/head', authMiddleware, async (req, res) => {
    try {
        const { householdId } = req.params;
        const { newHeadId } = req.body;

        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        const newHead = await Resident.findById(newHeadId);
        if (!newHead || newHead.householdId.toString() !== householdId) {
            return res.status(400).json({ error: 'Selected member is not part of this household' });
        }

        const oldHeadId = household.headMemberId;
        
        // Update old head
        await Resident.findByIdAndUpdate(oldHeadId, { isHouseholdHead: false });
        
        // Update new head
        await Resident.findByIdAndUpdate(newHeadId, { isHouseholdHead: true });
        
        // Update household
        household.headMemberId = newHeadId;
        household.updatedBy = req.user.userId;
        household.dateUpdated = new Date();
        await household.save();

        // Create audit log
        await createHouseholdAudit(householdId, 'head_changed', req.user.userId, {
            oldHeadId: oldHeadId,
            newHeadId: newHeadId
        }, {
            memberId: newHeadId,
            memberName: `${newHead.first_name} ${newHead.last_name}`,
            actionType: 'made_head'
        });

        const updatedHousehold = await Household.findById(householdId)
            .populate('headMemberId', 'first_name middle_name last_name');

        res.json(updatedHousehold);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unassigned residents
routes.get('/api/residents/unassigned', authMiddleware, async (req, res) => {
    try {
        const unassignedResidents = await Resident.find({ 
            householdId: null,
            'registration.status': 'active'
        });
        res.json(unassignedResidents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get household audit history
routes.get('/api/households/:id/audit', authMiddleware, async (req, res) => {
    try {
        const auditLogs = await HouseholdAudit.find({ householdId: req.params.id })
            .populate('changedBy', 'username fullname')
            .populate('memberDetails.memberId', 'first_name last_name')
            .sort({ timestamp: -1 });
        
        res.json(auditLogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete household (soft delete)
routes.delete('/api/households/:id', authMiddleware, async (req, res) => {
    try {
        const household = await Household.findById(req.params.id);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        // Unassign all members
        await Resident.updateMany(
            { householdId: req.params.id },
            { 
                householdId: null, 
                isHouseholdHead: false,
                householdAddress: null 
            }
        );

        // Soft delete household
        household.status = 'inactive';
        household.updatedBy = req.user.userId;
        household.dateUpdated = new Date();
        await household.save();

        // Create audit log
        await createHouseholdAudit(req.params.id, 'deleted', req.user.userId, {
            deletedAt: new Date()
        });

        res.json({ message: 'Household deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete household with residents (hard delete option)
routes.delete('/api/households/:id/with-residents', authMiddleware, requireRole('superadmin'), async (req, res) => {
    try {
        const household = await Household.findById(req.params.id);
        if (!household) {
            return res.status(404).json({ error: 'Household not found' });
        }

        // Get all household members for logging
        const members = await Resident.find({ householdId: req.params.id });
        
        // Delete all household members
        await Resident.deleteMany({ householdId: req.params.id });

        // Soft delete household
        household.status = 'inactive';
        household.updatedBy = req.user.userId;
        household.dateUpdated = new Date();
        await household.save();

        // Create audit log
        await createHouseholdAudit(req.params.id, 'deleted_with_residents', req.user.userId, {
            deletedAt: new Date(),
            deletedResidents: members.map(m => ({
                id: m._id,
                name: `${m.first_name} ${m.last_name}`,
                phone: m.contact?.phone
            }))
        });

        // Log admin action
        if (req.user && req.user.userId && req.user.username) {
            await AdminActionHistory.create({
                adminId: req.user.userId,
                adminUsername: req.user.username,
                action: 'deleted household with residents',
                target: req.params.id,
                details: {
                    householdId: req.params.id,
                    householdAddress: household.householdAddress,
                    deletedResidentsCount: members.length,
                    deletedResidents: members.map(m => `${m.first_name} ${m.last_name}`).join(', ')
                }
            });
        }

        res.json({ 
            message: 'Household and all residents deleted successfully',
            deletedResidentsCount: members.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = routes