// modules
const { Sequelize } = require('sequelize')
const express = require('express')
const { engine } = require('express-handlebars')
const db = require('./models')
const methodOverride = require('method-override')
// json
// const restaurants = require('./public/json/restaurant.json').results
// app
const app = express()
// server
const port = 3000
// model
const rest = db.rest
const category = db.category
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

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurant/new', (req, res) => {
  category.findAll({ attributes: ['id', 'name'], raw: true }).then((categories) => {
    res.render('create', { categories })
  })
})

app.get('/restaurants', (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = 2
  const index = true
  const keyword = req.query.search?.trim() // search = form name
  rest
    .findAll({
      attributes: [
        'id',
        'name',
        'name_en',
        'image',
        'location',
        'phone',
        'google_map',
        'rating',
        'description',
        [Sequelize.col('category.name'), 'category']
      ],
      include: [
        {
          model: category,
          attributes: ['name']
        }
      ],
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
      res.render('index', {
        restaurants: matched.slice((page - 1) * limit, page * limit),
        prev: page > 1 ? page - 1 : page,
        next: page + 1,
        page,
        index,
        keyword
      })
    })
})

app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  const categoryId = req.body.categoryId
  return rest
    .create({ name, name_en, image, location, phone, google_map, rating, description, categoryId })
    .then(() => {
      res.redirect('/restaurants')
    })
})

app.get('/restaurant/:id', (req, res) => {
  const editDelete = true
  const id = req.params.id
  return rest
    .findByPk(id, {
      attributes: [
        'id',
        'name',
        'name_en',
        'image',
        'location',
        'phone',
        'google_map',
        'rating',
        'description',
        [Sequelize.col('category.name'), 'category']
      ],
      include: [
        {
          model: category,
          attributes: ['name']
        }
      ],
      raw: true
    })
    .then((restaurant) => res.render('detail', { restaurant, editDelete }))
})

app.get('/restaurant/:id/edit', async (req, res) => {
  const id = req.params.id
  const categories = await category.findAll({ attributes: ['id', 'name'], raw: true })
  const restaurant = await rest
    .findByPk(id, {
      attributes: [
        'id',
        'name',
        'name_en',
        'image',
        'location',
        'phone',
        'google_map',
        'rating',
        'description',
        [Sequelize.col('category.id'), 'categoryId'],
        [Sequelize.col('category.name'), 'category']
      ],
      include: [
        {
          model: category,
          attributes: ['id', 'name']
        }
      ],
      raw: true
    })
    .then((restaurant) => res.render('edit', { restaurant, categories }))
})

app.put('/restaurant/:id', (req, res) => {
  const body = req.body
  const id = req.params.id

  return rest
    .update(
      {
        name: body.name,
        name_en: body.name_en,
        category: body.category,
        image: body.image,
        location: body.location,
        phone: body.phone,
        google_map: body.google_map,
        rating: body.rating,
        description: body.description
      },
      {
        where: { id }
      }
    )
    .then(() => res.redirect(`/restaurant/${id}`))
})

app.delete('/restaurant/:id', (req, res) => {
  const id = req.params.id

  return rest.destroy({ where: { id } }).then(() => res.redirect('/restaurants'))
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
