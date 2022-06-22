const [get_waifu, get_series] = require('../modules/anilist.js')

const express = require('express')

module.exports = express.Router()
    .post('/waifu', async (req, res) => res.send(await get_waifu(req.body.name, req.body.series)))
    .post('/series', async (req, res) => res.send(await get_series(req.body.name, req.body.page)))