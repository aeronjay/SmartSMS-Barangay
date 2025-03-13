require("dotenv").config();
const express = require('express')
const app = express()
const routes = require('./controllers/routes')
const cors = require('cors')
const mongoose = require('mongoose')

const path = require("path");


app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));



app.use('/', routes);
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html")); // Serve index.html correctly
});



module.exports = app;