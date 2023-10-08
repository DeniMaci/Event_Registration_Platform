const db = require("../Models");
const config = require("../Config/auth");
const User = db.User;
const Role = db.Role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const { username, email, password } = req.body;

  // Fetch the "User" role from the Role table
  Role.findOne({
    where: { name: 'User' }
  })
    .then((userRole) => {
      if (!userRole) {
        return res.status(500).send({ message: "Default role 'User' not found." });
      }

      // Create User with the fetched role's ID
      User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 8),
        roleId: userRole.id, // Set the user's role to "User" by default
      })
        .then((user) => {
          res.status(201).send({ message: "User registered successfully!" });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId, // Include the user's role in the response
        accessToken: token
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
