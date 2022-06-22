const express = require('express')

let wld_valid = (wld) => wld.match(/https:\/\/haste.bongo.best\/[\w]{10}\.txt/)

function set_wld_cookie(wld, res, next) {
    if (!wld_valid(wld || ''))
        return res.redirect('./')

    res.cookie('wld', wld)
    next()
}

module.exports = express.Router()
    .get('/', (req, res, next) => set_wld_cookie(req.query.wld, res, next))
    .post('/', (req, res, next) => set_wld_cookie(req.body.wld, res, next))