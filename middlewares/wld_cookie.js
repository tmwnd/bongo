const express = require('express')

let set_wld_cookie = (wld, res, next) => {
    res.cookie('wld', wld)
    next()
}

module.exports = express.Router()
    .get('/', (req, res, next) => set_wld_cookie(req.query.wld, res, next))
    .post('/', (req, res, next) => set_wld_cookie(req.body.wld, res, next))