// module
const { Sequelize } = require('sequelize')
const express = require('express')
const db = require('../models')
// router
const router = express.Router()
// model
const rest = db.rest
const category = db.category

router.get('/restaurant/new', (req, res) => {
  category.findAll({ attributes: ['id', 'name'], raw: true }).then((categories) => {
    res.render('create', { categories })
  })
})

router.get('/restaurants', (req, res) => {
  rest.count().then((total) => {
    const page = Number(req.query.page) || 1
    const limit = 3
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
        offset: (page - 1) * limit,
        limit,
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
          restaurants: matched,
          prev: page > 1 ? page - 1 : page,
          next: page * limit < total ? page + 1 : page,
          page,
          index,
          keyword
        })
      })
  })
})

router.post('/restaurants', (req, res, next) => {
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
    .create({
      name,
      name_en,
      image,
      location,
      phone,
      google_map,
      rating,
      description,
      categoryId
    })
    .then(() => {
      req.flash('success', '新增成功!')
      return res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗:('
      next(error)
    })
})

router.get('/restaurant/:id', (req, res) => {
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

router.get('/restaurant/:id/edit', async (req, res) => {
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

router.put('/restaurant/:id', (req, res, next) => {
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
    .then(() => {
      req.flash('success', '編輯成功!')
      return res.redirect(`/restaurant/${id}`)
    })
    .catch((error) => {
      error.errorMessage = '編輯失敗:('
      next(error)
    })
})

router.delete('/restaurant/:id', (req, res, next) => {
  const id = req.params.id

  return rest
    .destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功!')
      return res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router
