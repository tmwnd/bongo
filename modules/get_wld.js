const request = require('request')

const WLD_ROOT_URL = 'https://haste.bongo.best/raw/'

module.exports = function get_wld(url) {
    url = url.slice(url.lastIndexOf('/') + 1).replace('.txt', '')
    return new Promise((resolve, reject) => {
        request(WLD_ROOT_URL + url, {}, (html_err, html_res, body) => {
            if (html_res.statusCode == 404)
                reject()

            resolve(body)
        })
    })
}