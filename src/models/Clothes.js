'use strict';

module.exports = (Sequelize, DataTypes) => {
  const Clothes = Sequelize.define('Clothes', {
    name: { type: DataTypes.STRING, required: true },
    color: { type: DataTypes.STRING, required: true },
    size: { type: DataTypes.STRING, required: true }
  });

  return Clothes;
}


