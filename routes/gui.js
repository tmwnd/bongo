const express = require('express')
const Mustache = require('mustache')

let wld_valid = (wld) => wld.match(/https:\/\/haste.bongo.best\/[\w]{10}\.txt/)
let render_gui = (res, wld) => res.render('./../views/gui.html', { 'wld': wld })

module.exports = express.Router()
    .get('/', (req, res) => render_gui(res, req.query.wld))
    .post('/', (req, res) => render_gui(res, req.body.wld))