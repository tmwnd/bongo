const express = require('express')

module.exports = express.Router()
    .all('/', (req, res) => res.render('index.html', { wld: req.cookies.wld ?? '' }))