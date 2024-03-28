'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('rests', 'category')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('rests', 'category', {
      allowNull: false,
      type: Sequelize.STRING
    })
  }
}
