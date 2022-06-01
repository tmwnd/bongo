const path = require('path')
const express = require('express')

const app = express()
var gui_route = express.Router()

gui_route.use('/javascripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')))
gui_route.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', gui_route)

app.listen(3000)