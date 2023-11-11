'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const clothes = require('./Clothes.js');
const food = require('./Food.js');
const user = require('./Users.js')
const Collection = require('./collection.js');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;

const sequelizeDatabase = new Sequelize(DATABASE_URL);

const usersModel = user(sequelizeDatabase, DataTypes);
const foodModel = food(sequelizeDatabase, DataTypes);
const clothesModel = clothes(sequelizeDatabase, DataTypes);

module.exports = {
  sequelizeDatabase,
  usersCollection: new Collection(usersModel),
  foodCollection: new Collection(foodModel),
  clothesCollection: new Collection(clothesModel),
};
