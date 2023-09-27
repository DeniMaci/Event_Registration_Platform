// routes/Admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/AdminController');
const { authorizeRoles } = require('../Middleware/AuthorizationMiddleware');

// Require admin privileges using authMiddleware
router.use(authorizeRoles);
router.use(adminController.checkAdmin);

router.get('/dashboard', adminController.adminDashboard);

module.exports = router;
