const fs = require('fs')
const request = require('request')

const express = require('express')
const Mustache = require('mustache')

let wld_root_url = 'https://haste.bongo.best/raw/'
let series_tpl = fs.readFileSync(__dirname + '/../views/partials/series.html').toString()
let waifu_tpl = fs.readFileSync(__dirname + '/../views/partials/waifu.html').toString()

function render_gui(res, wld) {
    let wld_id = wld.slice(wld.lastIndexOf('/') + 1).replace('.txt', '')

    request(wld_root_url + wld_id, {}, (html_err, html_res, body) => {
        if (html_res.statusCode == 404)
            return

        let title = body.split('-----------------------', 2)[0].trim()

        let rendered_series = ''
        body.split('-----------------------').slice(1).forEach(series => {
            series = series.trim()

            let series_tite = series.split("\n", 2)[0]

            let rendered_waifus = ''
            series.split("\n").slice(1).forEach(waifu => rendered_waifus += Mustache.render(waifu_tpl, { 'name': waifu.trim().substring(2) }) + '\n')

            rendered_series += Mustache.render(series_tpl, { 'title': series_tite, 'waifus': rendered_waifus }) + '\n'
        })

        res.render('./../views/gui.html', { 'wld': wld, 'title': title, 'series': rendered_series })
    })
}

module.exports = express.Router()
    .get('/', (req, res) => render_gui(res, req.query.wld))
    .post('/', (req, res) => render_gui(res, req.body.wld))