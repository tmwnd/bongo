function set_trade_listener() {
    Array
        .from(document.getElementsByClassName('trade'))
        .forEach(btn_trade => {
            btn_trade.addEventListener('click', event => {
                btn = event
                    .target
                    .textContent
                // TODO
            })
        })
}

window.onload = () => {
    set_trade_listener()
}