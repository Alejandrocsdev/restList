'use strict'

/** @type {import('sequelize-cli').Migration} */

const fs = require('fs')
const path = require('path')
const data = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'public', 'json', 'restaurant.json'), 'utf8')
)
const results = data.results
const categoriesSet = new Set()
const categoriesData = []

results.forEach((e) => {
  categoriesSet.add(e.category)
})

categoriesSet.forEach((category) => {
  categoriesData.push({ name: category })
})

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', categoriesData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null)
  }
}
