function toggle_check(event) {
    let class_list = event.target.classList

    if (!class_list.contains('checked'))
        class_list.add('checked')
    else
        class_list.remove('checked')

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

function set_series_listener() {
    Array.from(document.getElementsByClassName('series')).forEach(series => {
        series.addEventListener('click', toggle_check)
        Array.from(series
            .parentElement
            .getElementsByClassName('waifus_outer')[0]
            .getElementsByClassName('waifus_inner')[0]
            .children
        ).forEach(waifu => waifu.addEventListener('click', toggle_check))
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