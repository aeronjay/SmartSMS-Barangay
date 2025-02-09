const routes = require('express').Router()
const mongoose = require('mongoose')


routes.get('/', (req, res) => {
    res.send('hello')
})

// add middleware to handle unknown route and error handler

module.exports = routes