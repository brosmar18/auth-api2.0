'use strict';

module.exports = (Sequelize, DataTypes) => {
  const Food = Sequelize.define('Food', {
    name: { type: DataTypes.STRING, required: true },
    calories: { type: DataTypes.INTEGER, required: true },
    type: { type: DataTypes.ENUM('fruit', 'vegetable', 'protein'), required: true }
  });
  
  return Food;
}

