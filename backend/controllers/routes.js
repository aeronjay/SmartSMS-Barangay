const routes = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

routes.get('/api', (req, res) => {
    res.send('hello')
})

routes.post("/api/register", async (req, res) => {
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

routes.post('/api/login', async (req, res) => {
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

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });
  
    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({ error: "Invalid token" });
    }
};

routes.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "You are authorized!" });
});


// add middleware to handle unknown route and error handler

module.exports = routes