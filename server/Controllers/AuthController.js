// Controllers/AuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../Models/User');
const { generateToken } = require('../_helpers/jwt');

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate and hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token
    const token = generateToken({ userId: user.id });

    res.status(201).json({ message: 'User registered', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
  
      // Generate JWT token upon successful login
      const token = generateToken({ userId: user.id });
  
      res.status(200).json({ message: 'Authentication successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  };

module.exports = {
  register,
  login,
};