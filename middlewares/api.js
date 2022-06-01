const express = require('express')

module.exports = express.Router()
    .use('/', (req, res, next) => {
        res.type('application/json')
        next()
    })