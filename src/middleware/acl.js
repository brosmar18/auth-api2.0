module.exports = (capability) => (req, res, next) => {
  try {
      if (req.user.capabilities.includes(capability)) {
          next();
      } else {
          console.log(`User ${req.user.username} attempted to ${capability} without sufficient permissions.`);
          res.status(403).send({
              message: `User ${req.user.username} does not have the ability to ${capability} a record.`
          });
      }
  } catch (e) {
      console.error("Error in ACL Middleware:", e);
      next(e);
  }
};
