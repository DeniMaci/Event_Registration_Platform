// routes/events.js
const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/EventController');
const { authenticate } = require('../Middleware/AuthenticationMiddleware');
const { authorizeRoles } = require('../Middleware/AuthorizationMiddleware');

// Require authentication for all event routes
router.use(authenticate);

// Define routes with role-based authorization
router.get('/events', eventController.getAllEvents);
router.get('/events/:eventId', eventController.getEventById);
router.post('/events', authorizeRoles('organizer', 'admin'), eventController.createEvent);
router.put('/events/:eventId', authorizeRoles('organizer', 'admin'), eventController.updateEvent);
router.delete('/events/:eventId', authorizeRoles('organizer', 'admin'), eventController.deleteEvent);
router.post('/register-event/:eventId', eventController.registerForEvent);

module.exports = router;
