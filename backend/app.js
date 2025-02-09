const express = require('express')
const app = express()
const routes = require('./controllers/routes')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use('/', routes);

module.exports = app;