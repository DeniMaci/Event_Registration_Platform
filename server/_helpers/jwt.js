// _helpers/jwt.js
const jwt = require('jsonwebtoken');

// Secret key for signing and verifying tokens
const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5NTEzMzQ4OSwiaWF0IjoxNjk1MTMzNDg5fQ.9-vdZBYj9dYDTcHqyZQRQM9fQH_MqFL_dLaP_tmvYZQ';

// Function to generate a JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Function to verify a JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
};

module.exports = { generateToken, verifyToken };