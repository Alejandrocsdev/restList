const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')

router.use('/restaurants', restaurants)

router.get('/', (req, res) => {
  res.send('This is Root page')
})

module.exports = router
