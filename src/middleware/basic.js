const base64 = require('base-64');
const bcrypt = require('bcrypt');
const { userModel } = require('../../models');

const basicAuth = async (req, res, next) => {
    let { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send("Not authorization header provided");
        return;
    }

    let authString = authorization.split(' ')[1];
    let decodedAuthString = base64.decode(authString);
    let [username, password] = decodedAuthString.split(':');

    console.log(`Authenticating user: ${username}`); // Debugging log

    let user = await userModel.findOne({ where: { username } });

    if (user) {
        let validUser = await bcrypt.compare(password, user.password);
        console.log("Valid User: ", validUser); // Debugging log

        if (validUser) {
            req.user = user;
            console.log("Authentication successful, calling next()"); // Debugging log
            next();
        } else {
            console.log("Authentication failed: Password incorrect"); // Debugging log
            res.status(403).send("Not Authorized (password incorrect)");
        }
    } else {
        console.log("Authentication failed: User does not exist"); // Debugging log
        res.status(403).send("Not Authorized (user doesn't exist in DB");
    }
};

module.exports = basicAuth;
