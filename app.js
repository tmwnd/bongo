const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const consolidate = require('consolidate')
const cookieParser = require('cookie-parser')

const app = express()
app.engine('html', consolidate.mustache)
app.set('views', __dirname + '/views');

/* middlewares */
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/trade', require('./middlewares/wld_cookie.js'))
app.use('/api', require('./middlewares/api.js'))

/* routes */
app.use(require('./routes/index.js'))
app.use('/trade', require('./routes/trade.js'))
app.use('/compare', require('./routes/compare.js'))

app.use(express.static(path.join(__dirname, 'public')))

/* rest */
app.use('/javascripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')))

const api = express.Router()

api.use(require('./rest/anime.js'))

app.use('/api', api)

app.listen((__dirname.includes('beta.bongo')) ? 3001 : 3000)