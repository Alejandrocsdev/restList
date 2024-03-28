'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add the categoryId column to the rests table
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

    // Step 2: Update the new categoryId column with the corresponding id from the categories table
    const rests = await queryInterface.sequelize.query('SELECT id, category FROM rests', {
      type: Sequelize.QueryTypes.SELECT
    })
    for (const rest of rests) {
      const category = await queryInterface.sequelize.query(
        `SELECT id FROM categories WHERE name = '${rest.category}'`,
        { type: Sequelize.QueryTypes.SELECT }
      )
      if (category.length > 0) {
        await queryInterface.sequelize.query(
          `UPDATE rests SET categoryId = ${category[0].id} WHERE id = ${rest.id}`
        )
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes made in the up function
    await queryInterface.removeColumn('rests', 'categoryId')
  }
}
