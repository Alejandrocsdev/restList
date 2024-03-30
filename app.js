// modules
const express = require('express')
const { engine } = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
// json
// const restaurants = require('./public/json/restaurant.json').results
// router
const router = require('./routes')
// app
const app = express()
// server
const port = 3000
// template engine
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
// static files
app.use(express.static('public'))
// handle form data
app.use(express.urlencoded({ extended: true }))
// handle put, patch, delete
app.use(methodOverride('_method'))
// handle session signing and verifying
app.use(
  session({
    secret: 'ThisIsSecret',
    resave: false,
    saveUninitialized: false
  })
)
// flash messages: manage messages in stateless HTTP requests
app.use(flash())
app.use(router)

app.listen(port, () => {
  console.log(`http://localhost:${port}/restaurants`)
})
