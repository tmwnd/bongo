const fs = require('fs')

const express = require('express')
const Mustache = require('mustache')

const get_wld = require('./../modules/get_wld.js')

const SERIES_TPL = fs.readFileSync(__dirname + '/../views/partials/series.html').toString()
const WAIFU_TPL = fs.readFileSync(__dirname + '/../views/partials/waifu.html').toString()

module.exports = express.Router()
    .post('/', (req, res) => {
        if (req.body.pre_rendered) {
            // TODO
        }

        get_wld(req.body.wld)
            .then(wld => {
                let title = wld.split('-----------------------', 2)[0].trim()

                let rendered_series = ''
                wld.split('-----------------------').slice(1).forEach(series => {
                    series = series.trim()

                    let series_tite = series.split("\n", 2)[0]

                    let rendered_waifus = ''
                    series.split("\n").slice(1).forEach(waifu =>
                        rendered_waifus += Mustache.render(WAIFU_TPL, {
                            'name': waifu.trim().substring(2)
                        }) + '\n'
                    )

                    rendered_series += Mustache.render(SERIES_TPL, {
                        'title': series_tite, 'waifus': rendered_waifus
                    }) + '\n'
                })

                res.render('trade.html', {
                    'title': title, 'wld': req.body.wld,
                    'series': rendered_series
                })
            })
            .catch(err => res.redirect('/'))
    })