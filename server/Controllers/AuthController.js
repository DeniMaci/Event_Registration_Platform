const db = require("../Models");
const config = require("../Config/auth");
const User = db.User;
const Role = db.Role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Fetch the "User" role from the Role table
    const userRole = await Role.findOne({ where: { name: 'User' } });
    if (!userRole) {
      return res.status(500).send({ message: "Default role 'User' not found." });
    }
    // Create User with the fetched role's ID
    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      roleId: userRole.id
    })
    return res.status(201).send({ message: "User registered successfully!" });
  }
  catch {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user)
      return res.status(404).send({ message: "User Not found." });

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

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
      roleId: user.roleId,
      accessToken: token
    });
  }
  catch {
    err => {
      res.status(500).send({ message: err.message });
    };
  };
};

exports.updateProfile = async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;
  const userId = req.userId;

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user)
      return res.status(404).send({ message: "User not found." });

    // Check if the provided current password matches the stored hashed password
    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Current password is incorrect.",
      });
    }

    // Update the user's profile fields (username and email)
    user.username = username;
    user.email = email;

    // If a new password is provided, update it (ensure you hash the new password)
    if (newPassword) {
      user.password = bcrypt.hashSync(newPassword, 8);
    }

    // Save the updated user
    await user.save();

    return res.status(200).send({ message: "Profile updated successfully." });
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  };
}