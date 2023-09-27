// Middleware/AuthenticationMiddleware.js
const { verifyToken } = require('../_helpers/jwt');

const authenticate = (req, res, next) => {
  // Get the token from the request header or query parameter
  const token = req.header('Authorization') || req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the token
  const { valid, decoded } = verifyToken(token);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Attach the decoded token to the request object for use in controllers
  req.user = decoded;

  next();
};

module.exports = { authenticate };