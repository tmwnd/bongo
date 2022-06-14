const get_waifu = require('../modules/waifu.js')

const express = require('express')

async function send(name, res) {
    res.send(await get_waifu(name))
}

module.exports = express.Router()
    .get('/img', (req, res) => send(req.query.name, res))
    .post('/img', (req, res) => send(req.body.name, res))