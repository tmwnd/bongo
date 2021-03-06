const HOLD_TIME = 250;
const WAIFU_INFO_TPL = fetch("/templates/partials/waifu_info.html").then(file => file.text())
const WAIFU_ATTRIBUTE_TPL = fetch("templates/partials/waifu_attribute.html").then(file => file.text())

const API_URL = "/api/"

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
            if (class_list.contains('checked'))
                waifu.classList.add('checked')
            else if (!class_list.contains('checked'))
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

            if (all) {
                series.classList.add('checked')
            }
        }
    }

    let checked_count = Array.from(
        document.getElementsByClassName('checked')
    )
        .filter(element => element.classList.contains('waifu'))
        .length

    if (checked_count == 0)
        document.getElementById('btn_trade').textContent = 'trade'
    else
        document.getElementById('btn_trade').textContent = `trade (${checked_count})`
}

async function waifu_info(event) {
    let [info_tpl, attribute_tpl] = await Promise.all([WAIFU_INFO_TPL, WAIFU_ATTRIBUTE_TPL])

    let info = document.getElementById('waifu_info')
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

    fetch(API_URL + 'waifu', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'name': name,
            'series': series
        })
    })
        .then(response => response.json())
        .then(response => {
            if (response)
                return response
            else
                Promise.reject()
        })
        .then(waifu => {
            waifu.series = series

            let keys = []
            let attributes = ''
            for (let key in waifu)
                keys.push(key)
            keys
                .filter(key => !['image', 'media', 'description'].includes(key))
                .filter(key => waifu[key])
                .forEach(key => attributes += Mustache.render(attribute_tpl, {
                    'key': key, 'value': waifu[key]
                }))

            info.innerHTML = Mustache.render(info_tpl, {
                'image': waifu.image, 'attributes': attributes
            })
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
                waifu_info(event)
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

function match(str1, str2) {
    if (str1.toLowerCase().includes(str2.toLowerCase()))
        return true

    return false
}

function filter(series, filter) {
    if (match(series.textContent, filter))
        return true

    let ret = false
    Array
        .from(series
            .parentElement
            .getElementsByClassName('waifus_outer')[0]
            .getElementsByClassName('waifus_inner')[0]
            .children)
        .forEach(waifu => {
            if (match(waifu.textContent, filter)) {
                ret = true
                return true
            }
        })

    return ret
}

function set_filter_listener() {
    document.getElementById('input_filter').addEventListener('input', event => {
        Array.from(document.getElementsByClassName('series'))
            .forEach(series => {
                if (filter(series, event.target.value))
                    series.parentElement.classList.remove('filtered')
                else
                    series.parentElement.classList.add('filtered')
            })
    })

    document.getElementById('ckb_complete').addEventListener('click', event => {
        if (event.target.checked)
            Array.from(document.getElementsByClassName('series'))
                .filter(series => {
                    series = series.textContent
                    series = series.substring(series.lastIndexOf('(') + 1)
                    series = series.slice(0, -1).split('/')

                    return series[0] != series[1]
                })
                .forEach(series => series.parentElement.classList.add('complete'));
        else
            Array.from(document.getElementsByClassName('series'))
                .filter(series => {
                    series = series.textContent
                    series = series.substring(series.lastIndexOf('(') + 1)
                    series = series.slice(0, -1).split('/')

                    return series[0] != series[1]
                })
                .forEach(series => series.parentElement.classList.remove('complete'));
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
        navigator.clipboard.writeText('b.trade' + trade.substring(1))
    })
}

window.onload = () => {
    set_series_listener()
    set_filter_listener()
    set_trade_listener()
}