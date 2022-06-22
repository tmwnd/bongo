const fs = require('fs')

const express = require('express')
const Mustache = require('mustache')

const get_wld = require('./../modules/get_wld.js')

const SERIES_TPL = fs.readFileSync(__dirname + '/../views/partials/series.html').toString()
const EMPTY_SERIES_TPL = fs.readFileSync(__dirname + '/../views/partials/empty_series.html').toString()
const WAIFU_TPL = fs.readFileSync(__dirname + '/../views/partials/waifu.html').toString()

module.exports = express.Router()
    .post('/', (req, res) => {
        Promise.all([
            get_wld(req.body.old_wld),
            get_wld(req.body.new_wld)
        ])
            .then(([old_wld, new_wld]) => {
                let old_title = old_wld.split('-----------------------', 2)[0].trim()
                let new_title = new_wld.split('-----------------------', 2)[0].trim()

                old_wld = old_wld.split('-----------------------').slice(1)
                new_wld = new_wld.split('-----------------------').slice(1)

                let old_rendered_series = ''
                let new_rendered_series = ''

                for (let old_series_ptr = 0, new_series_ptr = 0; ;) {
                    let old_series = old_wld[old_series_ptr]?.trim()
                    let new_series = new_wld[new_series_ptr]?.trim()

                    if (!old_series && !new_series)
                        break

                    let old_series_title = old_series?.split("\n", 2)[0]
                    let new_series_title = new_series?.split("\n", 2)[0]

                    let old_series_name = old_series_title?.substring(0, old_series_title.lastIndexOf('(') - 1)
                    let new_series_name = new_series_title?.substring(0, new_series_title.lastIndexOf('(') - 1)

                    if (!new_series_name || old_series_name < new_series_name) {
                        let rendered_waifus = ''
                        old_series.split("\n").slice(1).forEach(waifu =>
                            rendered_waifus += Mustache.render(WAIFU_TPL, {
                                'name': waifu.trim().substring(2)
                            }) + '\n'
                        )

                        let rendered_series = Mustache.render(SERIES_TPL, {
                            'title': old_series_title, 'waifus': rendered_waifus
                        })

                        old_rendered_series += rendered_series + '\n'
                        new_rendered_series += Mustache.render(EMPTY_SERIES_TPL, {
                            'series': rendered_series
                        }) + '\n'

                        old_series_ptr++
                        continue
                    } else if (!old_series_name || new_series_name < old_series_name) {
                        let rendered_waifus = ''
                        new_series.split("\n").slice(1).forEach(waifu =>
                            rendered_waifus += Mustache.render(WAIFU_TPL, {
                                'name': waifu.trim().substring(2)
                            }) + '\n'
                        )

                        let rendered_series = Mustache.render(SERIES_TPL, {
                            'title': new_series_title, 'waifus': rendered_waifus
                        })

                        new_rendered_series += rendered_series + '\n'
                        old_rendered_series += Mustache.render(EMPTY_SERIES_TPL, {
                            'series': rendered_series
                        }) + '\n'

                        new_series_ptr++
                        continue
                    } else if (old_series_title != new_series_title) {
                        let old_waifus = old_series.split("\n").slice(1)
                        let new_waifus = new_series.split("\n").slice(1)

                        let old_rendered_waifus = ''
                        let new_rendered_waifus = ''
                        for (let old_waifu_ptr = 0, new_waifu_ptr = 0; ;) {
                            let old_waifu = old_waifus[old_waifu_ptr]?.trim().substring(2)
                            let new_waifu = new_waifus[new_waifu_ptr]?.trim().substring(2)

                            if (!old_waifu && !new_waifu)
                                break

                            if (!new_waifu || old_waifu < new_waifu) {
                                old_rendered_waifus += Mustache.render(WAIFU_TPL, {
                                    'name': old_waifu
                                }) + '\n'

                                old_waifu_ptr++
                                continue
                            }
                            else if (!old_waifu || new_waifu < old_waifu) {
                                new_rendered_waifus += Mustache.render(WAIFU_TPL, {
                                    'name': new_waifu
                                }) + '\n'

                                new_waifu_ptr++
                                continue
                            }

                            old_waifu_ptr++
                            new_waifu_ptr++
                        }

                        old_rendered_series_add = Mustache.render(SERIES_TPL, {
                            'title': old_series_title, 'waifus': old_rendered_waifus
                        })
                        new_rendered_series_add = Mustache.render(SERIES_TPL, {
                            'title': new_series_title, 'waifus': new_rendered_waifus
                        })

                        if (old_rendered_waifus != '')
                            old_rendered_series += old_rendered_series_add + '\n'
                        else
                            old_rendered_series += Mustache.render(EMPTY_SERIES_TPL, {
                                'series': new_rendered_series_add
                            }) + '\n'

                        if (new_rendered_waifus != '')
                            new_rendered_series += new_rendered_series_add + '\n'
                        else
                            new_rendered_series += Mustache.render(EMPTY_SERIES_TPL, {
                                'series': old_rendered_series_add
                            }) + '\n'
                    }

                    old_series_ptr++
                    new_series_ptr++
                }

                res.render('compare.html', {
                    'old_title': old_title, 'old_wld': req.body.old_wld,
                    'old_series': old_rendered_series,
                    'new_title': new_title, 'new_wld': req.body.new_wld,
                    'new_series': new_rendered_series
                })
            })
            .catch(err => res.redirect('/'))
    })