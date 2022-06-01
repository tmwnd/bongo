let wld_valid = (wld) => wld.match(/https:\/\/haste.bongo.best\/[\w]{10}\.txt/)

let set_submit_listener = () => document.getElementById('button_submit').addEventListener('click', event => {
    let input_wld = document.getElementById('input_wld').value
    let input_old_wld = document.getElementById('input_old_wld').value

    if (input_wld == '')
        event.preventDefault()

    if (!wld_valid(input_wld))
        event.preventDefault()

    if (input_old_wld != '')
        if (!wld_valid(input_old_wld))
            event.preventDefault()
        else if (input_wld === input_old_wld)
            event.preventDefault()
})

let set_swap_listener = () => document.getElementById('button_swap').addEventListener('click', event => {
    let new_wld = document.getElementById('input_wld')
    let old_wld = document.getElementById('input_old_wld')

    let temp = new_wld.value
    new_wld.value = old_wld.value
    old_wld.value = temp

    event.preventDefault()
})

let set_cookie_wld = () => {
    fetch('./api/cookie')
        .then(response => response.text())
        .then(wld => document.getElementById('input_wld').value = wld)
}

fetch('./')
    .then(set_submit_listener)
    .then(set_swap_listener)
    .then(set_cookie_wld)