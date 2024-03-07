// modules
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
// import json data
const restaurants = require('./public/json/restaurant.json').results
const db = require('./models') // import from models
const rest = db.rest // declare model name
// (table: plural) (model: singular => plural)
// (table must end with 's')
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
  const keyword = req.query.search?.trim()
  const matched = keyword ? restaurants.filter((rest) =>
    Object.values(rest).some((property) => {
      if (typeof property === 'string') {
        return property.toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })
  ) : restaurants
  res.render('index', { restaurants: matched, keyword })
})

app.get('/restaurant/new', (req, res) => {
	res.send('create restaurant')
})

app.post('/restaurants', (req, res) => {
	res.send('add restaurant')
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((rest) => rest.id.toString() === id)
  res.render('detail', { restaurant })
})

app.get('/restaurant/:id/edit', (req, res) => {
	res.send(`get restaurant edit: ${req.params.id}`)
})

app.put('/restaurant/:id', (req, res) => {
	res.send('modify restaurant')
})

app.delete('/restaurant/:id', (req, res) => {
	res.send('delete restaurant')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
