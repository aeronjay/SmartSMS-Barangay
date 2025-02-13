const routes = require('express').Router()
const mongoose = require('mongoose')
const user = require('./models/User')

routes.get('/api', (req, res) => {
    res.send('hello')
})

// add middleware to handle unknown route and error handler

module.exports = routes