const express = require('express')
const request = require('request')

wld_root_url = 'https://haste.bongo.best/raw/'

function render_gui(res, wld) {
    let wld_id = wld.slice(wld.lastIndexOf('/') + 1).replace('.txt', '')
    request(wld_root_url + wld_id, {}, response => {
        console.log(response)
    })

    res.render('./../views/gui.html', { 'wld': wld })
}

module.exports = express.Router()
    .get('/', (req, res) => render_gui(res, req.query.wld))
    .post('/', (req, res) => render_gui(res, req.body.wld))