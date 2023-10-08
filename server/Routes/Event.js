const { authJwt } = require("../Middleware");
const EventController = require("../Controllers/EventController");

module.exports = function(app) {
// Create a new event
app.post(
  "/api/events",
  [authJwt.verifyToken, authJwt.isEventOrganizerOrAdmin],
  EventController.createEvent
);

// Edit an event by ID
app.put(
  "/api/events/:id",
  [authJwt.verifyToken, authJwt.isEventOrganizerOrAdmin],
  EventController.editEvent
);

// Delete an event by ID
app.delete(
  "/api/events/:id",
  [authJwt.verifyToken, authJwt.isEventOrganizerOrAdmin],
  EventController.deleteEvent
);

// Get a list of all events
app.get("/api/events", EventController.getAllEvents);

app.get("/api/events/:id", EventController.getEventById);

app.post(
  "/api/events/:eventId/register",
  [authJwt.verifyToken],
  EventController.registerForEvent
);

app.get(
  "/api/events/:eventId/attendees",
  [authJwt.verifyToken, authJwt.isEventOrganizerOrAdmin],
  EventController.getEventAttendees
);

};
