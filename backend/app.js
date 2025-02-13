require("dotenv").config();
const express = require('express')
const app = express()
const routes = require('./controllers/routes')
const cors = require('cors')
const mongoose = require('mongoose')


app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));



app.use('/', routes);

module.exports = app;