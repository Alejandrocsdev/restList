'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('rests', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'categories', // Name of the referenced table
        key: 'id' // Name of the referenced column
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('rests', 'categoryId')
  }
}
