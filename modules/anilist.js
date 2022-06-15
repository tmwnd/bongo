const request = require('request')

function match(str1, str2) {
    if (!str1 || !str2)
        return false

    if (str1.includes(str2) || str2.includes(str1))
        return true

    return false
}

let series_attributes = `
    title {
        english
    }
    coverImage {
        large
    }
`

let waifu_attributes = `
    name {
        full
    }
    image {
        large
    }
    gender
    dateOfBirth {
        year
        month
        day
    }
    age
    bloodType
    description
`

let query_series = `
    query ($name: String, $page: Int) { 
        Media (search: $name) {
            ${series_attributes}
            characters (page: $page) {
                nodes {
                    ${waifu_attributes}
                }
            }
        }
    }
`

let query_waifu = `
    query ($name: String) { 
        Character (search: $name) {
            ${waifu_attributes}
            media {
                nodes {
                    ${series_attributes}
                }
            }
        }
    }
`

function format_date_partial(partial, n = 2) {
    return ('0'.repeat(n) + partial).slice(-n)
}
function format_date(date) {
    if (!date.day)
        return null

    let formatted_date = ''

    if (date.year)
        formatted_date += format_date_partial(date.year, 4) + "-"
    if (date.month)
        formatted_date += format_date_partial(date.month) + "-"

    formatted_date += format_date_partial(date.day)

    return formatted_date
}

function format_series(series) {
    series.title = series.title.english
    series.coverImage = series.coverImage.large

    return series
}

function format_waifu(waifu) {
    waifu.name = waifu.name.full
    waifu.image = waifu.image.large

    waifu.dateOfBirth = format_date(waifu.dateOfBirth)

    if (waifu.description)
        waifu
            .description
            .split('\n\n', 2)[0]
            .split('\n')
            .filter(attribute => attribute.startsWith('__'))
            .map(attribute => attribute.substring(2))
            .forEach(attribute => {
                attribute = attribute.split('__ ')
                key = attribute[0].slice(0, -1)
                value = attribute[1]

                if (key && value)
                    waifu[key] = value
            })

    return waifu
}

function get_series(name, page = 1) {
    return new Promise(resolve =>
        request.post('https://graphql.anilist.co', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                'query': query_series,
                'variables': {
                    'name': name,
                    'page': page
                }
            })
        }, (html_err, html_res, body) => {
            body = JSON.parse(body)

            if (body.errors)
                return resolve(null)

            let series = format_series(body.data.Media)
            series.characters = series.characters.nodes
            series.characters.forEach(waifu => waifu = format_waifu(waifu))

            resolve(series)
        })
    )
}

function get_waifu(name, series = null) {
    return new Promise(async resolve => {
        let waifus

        if (series) {
            for (let page = 1; ; page++) {
                waifus = await get_series(series, page)

                if (!waifus || waifus.characters.length == 0)
                    break

                waifus = waifus
                    .characters
                    .filter(waifu => waifu.name == name)

                if (waifus.length == 1)
                    break
            }

            if (waifus && waifus[0])
                resolve(waifus[0])
            else {
                let waifu = await get_waifu(name)
                if (waifu &&
                    waifu
                        .media
                        .map(series => series.title)
                        .filter(title => match(series, title))
                        .length != 0
                )
                    resolve(waifu)
                else
                    resolve(null)
            }
        }
        else
            request.post('https://graphql.anilist.co', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'query': query_waifu,
                    'variables': {
                        'name': name
                    }
                })
            }, (html_err, html_res, body) => {
                body = JSON.parse(body)

                if (body.errors)
                    return resolve(null)

                let waifu = format_waifu(body.data.Character)
                waifu.media = waifu.media.nodes
                waifu.media.forEach(series => series = format_series(series))

                resolve(waifu)
            })
    })

}

module.exports = [get_waifu, get_series]