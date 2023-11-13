'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const clothes = require('./Clothes.js');
const food = require('./Food.js');
const user = require('./Users.js')
const courses = require('./Courses.js');
const Collection = require('./collection.js');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;

const sequelizeDatabase = new Sequelize(DATABASE_URL);

const usersModel = user(sequelizeDatabase, DataTypes);
const foodModel = food(sequelizeDatabase, DataTypes);
const clothesModel = clothes(sequelizeDatabase, DataTypes);
const coursesModel = courses(sequelizeDatabase, DataTypes);

// Define many-to-many association
usersModel.belongsToMany(coursesModel, { through: 'UserCourses' });
coursesModel.belongsToMany(usersModel, { through: 'UserCourses' });

module.exports = {
  sequelizeDatabase,
  usersCollection: new Collection(usersModel),
  foodCollection: new Collection(foodModel),
  clothesCollection: new Collection(clothesModel),
  coursesCollection: new Collection(coursesModel)
};
