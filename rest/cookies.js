const express = require('express')

module.exports = express.Router()
    .all('/', (req, res) => {
        res.type('text/plain')
        res.send(req.cookies.wld)
    })