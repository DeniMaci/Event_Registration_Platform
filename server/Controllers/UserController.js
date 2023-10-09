const db = require("../Models");
const User = db.User;
const bcrypt = require("bcryptjs");

// Create a new user
exports.createUser = (req, res) => {
  // Implement validation and authorization checks here
  const { username, email, password, roleId } = req.body;

  // Hash the password before saving it to the database
  const hashedPassword = bcrypt.hashSync(password, 8);

  User.create({
    username,
    email,
    password: hashedPassword, // Store the hashed password
    roleId: roleId, // Set the roleId directly
  })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Edit an existing user by ID
exports.editUser = (req, res) => {
  const userId = req.params.id; // Assuming you receive the user ID in the request parameters
  const { username, email, password, role } = req.body;
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Update user fields
      user.username = username;
      user.email = email;
      user.password = bcrypt.hashSync(password, 8); 
      user.roleId = role; 

      // Save the updated user
      user
        .save()
        .then(() => {
          res.status(200).json(user);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Delete a user by ID
exports.deleteUser = (req, res) => {
  // Implement validation and authorization checks here
  const userId = req.params.id; // Assuming you receive the user ID in the request parameters

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Delete the user
      user
        .destroy()
        .then(() => {
          res.status(204).json(); // No content response for successful deletion
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get a list of all users
exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get a user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Respond with the user data
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
