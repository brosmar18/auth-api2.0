// Import the sequelizeDatabase
const { sequelizeDatabase } = require('../models');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next("Not Authorized, no token present!");
  } else {
    try {
      let authType = req.headers.authorization.split(' ')[0];
      if (authType === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        console.log("Token from bearer middleware: ", token);

        // Access the User model directly from sequelizeDatabase
        let validUser = await sequelizeDatabase.models.User.authenticateBearer(token);
        if (validUser) {
          req.user = validUser;
          next();
        } else {
          next("Send a token in a bearer with auth string");
        }
      }
    } catch (e) {
      console.error(e);
      next(new Error("Error processing the token"));
    }
  }
};
