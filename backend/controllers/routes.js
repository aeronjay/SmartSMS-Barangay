const routes = require('express').Router()
const User = require('../models/User')
const Resident = require('../models/resident')
const History = require('../models/History')
const Request = require('../models/DocumentRequest')
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


// routes.get('/api', (req, res) => {
//     res.send('hello')
// })

// routes.post("/api/admin/register", async (req, res) => {
//     try {
//       const { username, password } = req.body;
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       const newUser = new User({ username, password: hashedPassword });
//       await newUser.save();

//       res.status(201).json({ message: "User registered successfully!" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

routes.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const currentUser = await User.findOne({ username })

        if (!currentUser) return res.status(400).json({ error: "USER NOT FOUND" })

        const isMatch = await bcrypt.compare(password, currentUser.password);
        if (!isMatch) return res.status(400).json({ error: 'INVALID CREDS!' })

        const token = jwt.sign({ userId: currentUser._id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        res.json({ token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// routes.post('/api/admin/broadcast', async (req, res) => {
//     // not working yet, need API KEY AND DEVICEID
//     try {
//         const { recipients, message } = req.body;

//         // Validate input
//         if (!Array.isArray(recipients) || recipients.length === 0) {
//             return res.status(400).json({ error: 'Recipients array is required and must not be empty.' });
//         }
//         if (typeof message !== 'string' || message.trim() === '') {
//             return res.status(400).json({ error: 'Message is required and must not be empty.' });
//         }

//         const apiData = {
//             recipients: recipients,
//             message: message,
//         };

//         const apiUrl = `https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/send-sms`;

//         const response = await axios.post(apiUrl, apiData, {
//             headers: {
//                 'x-api-key': API_KEY,
//             },
//         });

//         if (response.status === 200) {
//             res.status(200).json({ success: true, message: 'SMS broadcast successful', data: response.data });
//         } else {
//             res.status(response.status).json({ success: false, message: 'SMS broadcast failed', error: response.data });
//         }
//     } catch (error) {
//         console.error('Error broadcasting SMS:', error);
//         res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//     }
// });





// routes.get("/protected", authMiddleware, (req, res) => {
//     res.json({ message: "You are authorized!" });
// });
routes.delete('/api/resident/delete/:id', async (req, res) => {
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

routes.post('/api/resident/register', async (req, res) => {
    try {
        const newResident = new Resident(req.body);
        await newResident.save();
        res.status(201).json(newResident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

routes.get('/api/resident/all', async (req, res) => {
    try {
        const residents = await Resident.find();
        res.status(200).json(residents);
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})
routes.put('/api/resident/update/:id', async (req, res) => {
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


routes.get('/api/history/getall', async (req, res) => {
    try {
        const history = await History.find()
            .select('phoneNumbers message messageId status createdAt') // Select only needed fields
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Req Documents 



routes.post('/api/resident/documentRequest', async (req, res) => {
    try {
        // Check for validation errors
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        // Extract request data from request body
        const {
            email,
            phoneNumber,
            address,
            fullName,
            purpose,
            documentType
        } = req.body;

        // Create a new request
        const newRequest = new Request({
            email,
            phoneNumber,
            address,
            fullName,
            purpose,
            documentType
        });

        // Save the request to the database
        const savedRequest = await newRequest.save();

        // Return success response
        return res.status(201).json({
            message: 'Document request submitted successfully',
            requestId: savedRequest._id
        });
    } catch (error) {
        console.error('Error submitting document request:', error);
        return res.status(500).json({
            message: 'An error occurred while processing your request'
        });
    }
});
routes.get('/api/admin/allrequest', async (req, res) => {
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
routes.get('/api/admin/pendingrequest', async (req, res) => {
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

// Route 3: Admin approves or rejects a request
routes.put('/api/admin/requests/:id', async (req, res) => {
    try {
        // Check for validation errors
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        const { id } = req.params;
        const { status } = req.body;

        // Find and update the request
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        // Check if request exists
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Return the updated request
        return res.status(200).json({
            message: `Request ${status} successfully`,
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error updating request status:', error);
        return res.status(500).json({
            message: 'An error occurred while updating the request status'
        });
    }
});

// Optional: Route to get all requests (can be used for admin dashboard)
// routes.get('/api/requests', async (req, res) => {
//     try {
//         // Optional query parameters for filtering
//         const { status } = req.query;

//         // Build query object
//         const query = {};
//         if (status) {
//             query.status = status;
//         }

//         // Fetch requests based on query
//         const requests = await Request.find(query).sort({ createdAt: -1 });

//         return res.status(200).json({
//             count: requests.length,
//             requests
//         });
//     } catch (error) {
//         console.error('Error fetching requests:', error);
//         return res.status(500).json({
//             message: 'An error occurred while fetching requests'
//         });
//     }
// });

// Optional: Route to get a specific request by ID
// routes.get('/api/requests/:id', param('id').isMongoId(), async (req, res) => {
//     try {
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { id } = req.params;
//         const request = await Request.findById(id);

//         if (!request) {
//             return res.status(404).json({ message: 'Request not found' });
//         }

//         return res.status(200).json(request);
//     } catch (error) {
//         console.error('Error fetching request:', error);
//         return res.status(500).json({
//             message: 'An error occurred while fetching the request'
//         });
//     }
// });


// add middleware to handle unknown route and error handler

module.exports = routes