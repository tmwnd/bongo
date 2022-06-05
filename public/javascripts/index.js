function set_submit_listener() {
    document.getElementById('button_submit').addEventListener('click', event => {
        let input_wld = document.getElementById('input_wld').value
        let input_old_wld = document.getElementById('input_old_wld').value

        if (input_old_wld != '' && input_wld === input_old_wld)
            event.preventDefault()
    })
}

function set_swap_listener() {
    document.getElementById('button_swap').addEventListener('click', event => {
        let new_wld = document.getElementById('input_wld')
        let old_wld = document.getElementById('input_old_wld')

        let temp = new_wld.value
        new_wld.value = old_wld.value
        old_wld.value = temp

        event.preventDefault()
    })
}

fetch('./')
    .then(set_submit_listener)
    .then(set_swap_listener)