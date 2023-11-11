'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET = process.env.SECRET || 'secretstring';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    username: { type: DataTypes.STRING, required: true, unique: true },
    password: { type: DataTypes.STRING, required: true },
    role: { type: DataTypes.ENUM('user', 'writer', 'editor', 'admin'), required: true, defaultValue: 'user'},
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET, {expiresIn: 1000* 60 * 60 * 15});
      },
      set() {
        return jwt.sign({ username: this.username }, SECRET, {expiresIn: 1000* 60 * 60 * 15});
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['read'],
          writer: ['read', 'create'],
          editor: ['read', 'create', 'update'],
          admin: ['read', 'create', 'update', 'delete']
        };
        return acl[this.role];
      }
    }
  });

  User.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    console.log("Hashed pass in beforeCreate: ", hashedPass);
    user.password = hashedPass;
    console.log('Creating User: ', JSON.stringify(user ,null, 2));
  });


  User.authenticateBearer = async (token) => {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = await User.findOne({where: { username: parsedToken.username } });
      if (user) { 
        return user; 
      } else {
        throw new Error("User Not Found");
      }
      
    } catch (e) {
      throw new Error(e.message)
    }
  };

  return User;
}


