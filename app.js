// modules
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
// import json data
const restaurants = require('./public/json/restaurant.json').results

// template engine
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
// static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  res.render('index', { restaurants })
})

// app.get('/restaurant/:id', (req, res) => {
//   // const id = req.params.id
//   res.render('detail', { restaurants })
//   // res.send(`read restaurant: ${id}`)
// })

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((rest) => rest.id.toString() === id)
  res.render('detail', { restaurant })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
