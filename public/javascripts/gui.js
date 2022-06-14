const HOLD_TIME = 250;
const POPUP_TPL = fetch("/templates/partials/waifu_popup.html").then(file => file.text())

const API_URL = "https://beta.bongo.tmwnd.de/api/"

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
    let name = event
        .target
        .textContent
    let series = event
        .target
        .parentElement
        .parentElement
        .parentElement
        .getElementsByClassName('series')[0]
        .textContent

    series = series.substring(0, series.lastIndexOf('(') - 1)

    fetch(API_URL + "img?name=" + name)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            if (response)
                return response
            else
                Promise.reject()
        })
        .then(response => {
            popup.innerHTML = Mustache.render(tpl, {
                'img_url': response.image,
                'name': name,
                'series': series
            })

            popup.classList.add('show')
        })
        .catch(err => console.log(`waifu ${name} not found`))
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
                } else
                    document.getElementById('waifu_popup').classList.remove('show')
            })
        })
    })
}

function set_trade_listener() {
    document.getElementById('btn_trade').addEventListener('click', event => {
        let trade = ''
        Array.from(document.getElementsByClassName('series')).forEach(series => {
            if (series.classList.contains('checked'))

                trade += `, s ${series.textContent.substring(0, series.textContent.lastIndexOf('(') - 1)}`
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