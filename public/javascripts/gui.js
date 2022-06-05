const HOLD_TIME = 250;
const POPUP_TPL = fetch("/templates/partials/waifu_popup.html").then(file => file.text())

function toggle_check(event) {
    let class_list = event.target.classList

    class_list.toggle('checked')

    if (class_list.contains('series')) {
        Array.from(event
            .target
            .parentElement
            .getElementsByClassName('waifus_outer')[0]
            .getElementsByClassName('waifus_inner')[0]
            .children
        ).forEach(waifu => {
            if (class_list.contains('checked') && !waifu.classList.contains('checked'))
                waifu.classList.add('checked')
            else if (!class_list.contains('checked') && waifu.classList.contains('checked'))
                waifu.classList.remove('checked')
        })
    } else if (class_list.contains('waifu')) {
        let series = event
            .target
            .parentElement
            .parentElement
            .parentElement
            .getElementsByClassName('series')[0]

        if (!class_list.contains('checked')) {
            if (series.classList.contains('checked'))
                series.classList.remove('checked')
        } else {
            let all = true
            Array.from(event
                .target
                .parentElement
                .children
            ).forEach(waifu => {
                all = all && waifu.classList.contains('checked')
                if (!all) return
            })

            if (all && !series.classList.contains('checked')) {
                series.classList.add('checked')
            }
        }
    }
}

async function waifu_popup(event) {
    let tpl = await POPUP_TPL

    let popup = document.getElementById('waifu_popup')
    let waifu = event
        .target
        .textContent
    let series = event
        .target
        .parentElement
        .parentElement
        .parentElement
        .getElementsByClassName('series')[0]
        .textContent
    popup.innerHTML = Mustache.render(tpl, {
        'img_url': 'https://bot.to/wp-content/uploads/2020/09/bongo_5f70261889b78.png',
        'name': waifu,
        'series': series
    })

    if (!popup.classList.contains('show'))
        popup.classList.add('show')

    document.getElementById('btn_popup').addEventListener('click', event => {
        if (popup.classList.contains('show'))
            popup.classList.remove('show')
    })
}

function set_series_listener() {
    let timeout_id = 0
    Array.from(document.getElementsByClassName('series')).forEach(series => {
        series.addEventListener('click', toggle_check)
        Array.from(series
            .parentElement
            .getElementsByClassName('waifus_outer')[0]
            .getElementsByClassName('waifus_inner')[0]
            .children
        ).forEach(waifu => {
            // waifu.addEventListener('click', toggle_check)
            waifu.addEventListener('mousedown', event => timeout_id = setTimeout(() => {
                timeout_id = 0
                waifu_popup(event)
            }, HOLD_TIME))
            waifu.addEventListener('mouseup', event => {
                if (timeout_id != 0) {
                    clearTimeout(timeout_id)
                    toggle_check(event)
                }
            })
        })
    })
}

function set_trade_listener() {
    document.getElementById('btn_trade').addEventListener('click', event => {
        let trade = ''
        Array.from(document.getElementsByClassName('series')).forEach(series => {
            if (series.classList.contains('checked'))
                trade += `, s ${series.textContent}`
            else {
                Array.from(series
                    .parentElement
                    .getElementsByClassName('waifus_outer')[0]
                    .getElementsByClassName('waifus_inner')[0]
                    .children
                ).forEach(waifu => {
                    if (waifu.classList.contains('checked'))
                        trade += `, w ${waifu.textContent}`
                })
            }
        })
        console.log('b.trade' + trade.substring(1))
    })
}

fetch('/')
    .then(set_series_listener)
    .then(set_trade_listener)