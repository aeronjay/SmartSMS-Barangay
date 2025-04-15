const routes = require('express').Router()
const User = require('../models/User')
const Resident = require('../models/resident')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if(!authHeader) return res.status(401).json({  error: "access denied"  });

    const token = authHeader.split(" ")[1];
    if(!token)return res.status(401).json({  error: "access denied"  });

    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified;
      next();
  } catch (err) {
      res.status(400).json({ error: "Invalid token" });
  }
};


routes.get('/api', (req, res) => {
    res.send('hello')
})

routes.post("/api/admin/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

routes.post('/api/admin/login', async (req, res) => {
    try{
        const { username, password } = req.body
        const currentUser = await User.findOne({ username })

        if(!currentUser) return res.status(400).json({ error: "USER NOT FOUND"})
        
        const isMatch = await bcrypt.compare(password, currentUser.password);
        if(!isMatch) return res.status(400).json({ error: 'INVALID CREDS!' })

        const token = jwt.sign({ userId: currentUser._id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        res.json({ token })
    }catch(err) {
        res.status(400).json({ error: err.message })
    }
})

routes.post('/api/admin/broadcast', async (req, res) => {
    // not working yet, need API KEY AND DEVICEID
    try {
        const { recipients, message } = req.body;

        // Validate input
        if (!Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ error: 'Recipients array is required and must not be empty.' });
        }
        if (typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required and must not be empty.' });
        }

        const apiData = {
            recipients: recipients,
            message: message,
        };

        const apiUrl = `https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/send-sms`;

        const response = await axios.post(apiUrl, apiData, {
            headers: {
                'x-api-key': API_KEY,
            },
        });

        if (response.status === 200) {
            res.status(200).json({ success: true, message: 'SMS broadcast successful', data: response.data });
        } else {
            res.status(response.status).json({ success: false, message: 'SMS broadcast failed', error: response.data });
        }
    } catch (error) {
        console.error('Error broadcasting SMS:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});





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


// add middleware to handle unknown route and error handler

module.exports = routes