'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class rest extends Model {
    static associate(models) {
      rest.belongsTo(models.category, { foreignKey: 'categoryId' })
    }
  }
  rest.init(
    {
      name: DataTypes.STRING,
      name_en: DataTypes.STRING,
      image: DataTypes.STRING,
      location: DataTypes.STRING,
      phone: DataTypes.STRING,
      google_map: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      description: DataTypes.STRING,
      categoryId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'rest'
    }
  )
  return rest
}
