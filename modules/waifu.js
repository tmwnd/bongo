const request = require('request')

query = `
    query ($name: String) { 
        Character (search: $name) {
            id
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
        }
    }
`

module.exports = (name) => {
    return new Promise(resolve =>
        request.post('https://graphql.anilist.co', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: { name: name }
            })
        }, (html_err, html_res, body) => {
            body = JSON.parse(body)

            if (body.errors)
                return resolve(null)

            let waifu = body.data.Character

            waifu.name = waifu.name.full
            waifu.image = waifu.image.large
            let dateOfBirth = waifu.dateOfBirth.day
            if (waifu.dateOfBirth.month) {
                dateOfBirth = waifu.dateOfBirth.month + '-' + dateOfBirth
                if (waifu.dateOfBirth.year)
                    dateOfBirth = waifu.dateOfBirth.year + '-' + dateOfBirth
            }
            waifu.dateOfBirth = dateOfBirth

            resolve(waifu)
        })
    )
}