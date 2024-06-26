const jwt = require("jsonwebtoken");
const config = require("../Config/auth");
const db = require("../Models");
const User = db.User;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token)
    return res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err)
      return res.status(401).send({ message: "Unauthorized!" });
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (user.roleId === 3)
    next();
  else
    res.status(403).send({ message: "Require Admin Role!" });
};

isEventOrganizer = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (user.roleId === 2)
    next()
  else
    res.status(403).send({ message: "Require Event Organizer Role!" });
};

isEventOrganizerOrAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (user.roleId === 2 || user.roleId === 3)
    next();
  else
    res.status(403).send({ message: "Require Event Organizer or Admin Role!" });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isEventOrganizer: isEventOrganizer,
  isEventOrganizerOrAdmin: isEventOrganizerOrAdmin
};
module.exports = authJwt;
