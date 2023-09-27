// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');
const { authenticate } = require('../Middleware/AuthenticationMiddleware');
const { authorizeRoles } = require('../Middleware/AuthorizationMiddleware');

// Require authentication for all user routes
router.use(authenticate);

// Define routes with role-based authorization
router.get('/users', authorizeRoles('admin'), userController.getAllUsers);
router.get('/users/:userId', authorizeRoles('admin'), userController.getUserById);
router.put('/users/:userId', authorizeRoles('admin'), userController.updateUser);
router.delete('/users/:userId', authorizeRoles('admin'), userController.deleteUser);

module.exports = router;
