const path = require('path')

const express = require('express')
const consolidate = require('consolidate')
const cookieParser = require('cookie-parser')

const app = express()
app.engine('html', consolidate.mustache)

/* middlewares */
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/gui', require('./middlewares/wld_cookie.js'))
app.use('/api', require('./middlewares/api.js'))

/* routes */
app.use('/gui', require('./routes/gui.js'))

app.use(require('./routes/index.js'))
app.use(express.static(path.join(__dirname, 'public')))

/* rest */
app.use('/javascripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')))

const api = express.Router()
app.use('/api', api)

app.listen((__dirname.includes('beta.bongo')) ? 3001 : 3000)