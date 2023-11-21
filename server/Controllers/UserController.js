const db = require("../Models");
const User = db.User;
const bcrypt = require("bcryptjs");

// Create a new user
exports.createUser = async (req, res) => {
  const { username, email, password, roleId } = req.body;
  // Hash the password before saving it to the database
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      roleId: roleId
    })
    return res.status(201).json(user);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Edit an existing user by ID
exports.editUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;
  try {
    const user = await User.findByPk(userId)
    if (!user)
      return res.status(404).json({ message: "User Not Found." });

    // Update user fields
    user.username = username;
    user.email = email;
    user.roleId = role;

    // Save the updated user
    await user.save();
    return res.status(200).json(user);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: "User Not Found" });

    // Delete the user
    await user.destroy();
    return res.status(204).json()
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get a list of all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: "User Not Found." });
    return res.status(200).json(user);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
