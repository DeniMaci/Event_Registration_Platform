const db = require("../Models");
const ROLES = db.ROLES;
const User = db.User;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  const userName = await User.findOne({ where: { username: req.body.username } });
  if (userName)
    return res.status(400).send({ message: "Failed! Username is already in use!" });
  // Email
  const userEmail = await User.findOne({ where: { email: req.body.email } });
  if (userEmail)
    return res.status(400).send({ message: "Failed! Email is already in use!" });
  next();
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({ message: "Failed! Role does not exist = " + req.body.roles[i] });
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
