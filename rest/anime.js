const [get_waifu, get_series] = require('../modules/anilist.js')


const express = require('express')

async function waifu(name, series, res) {
    res.send(await get_waifu(name, series))
}

async function series(name, page, res) {
    res.send(await get_series(name, page))
}

module.exports = express.Router()
    .get('/waifu', (req, res) => waifu(req.query.name, req.query.series, res))
    .post('/waifu', (req, res) => waifu(req.body.name, req.body.series, res))
    .get('/series', (req, res) => series(req.query.name, req.query.page, res))
    .post('/series', (req, res) => series(req.body.name, req.body.page, res))