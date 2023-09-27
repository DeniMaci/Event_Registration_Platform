// Middleware/AuthorizationMiddleware.js
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      const { role } = req.user;
  
      if (!roles.includes(role)) {
        return res.status(403).json({ error: 'Access denied. Insufficient role privileges.' });
      }
  
      next();
    };
  };
  
module.exports = { authorizeRoles };