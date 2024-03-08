// modules
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
// import json data
// const restaurants = require('./public/json/restaurant.json').results
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
// form data
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurant/new', (req, res) => {
  res.render('create')
})

app.get('/restaurants', (req, res) => {
  const index = true
  const keyword = req.query.search?.trim() // search = form name
  rest
    .findAll({
      // attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
      raw: true
    })
    .then((restaurants) => {
      const matched = keyword
        ? restaurants.filter((restaurant) =>
            Object.values(restaurant).some((property) => {
              if (typeof property === 'string') {
                return property.toLowerCase().includes(keyword.toLowerCase())
              }
            })
          )
        : restaurants
      res.render('index', { restaurants: matched, index, keyword })
    })
})

app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return rest
    .create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/restaurants'))
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
