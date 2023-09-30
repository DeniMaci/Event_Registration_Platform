const { authJwt } = require("../Middleware");
const EventController = require("../Controllers/EventController");

module.exports = function(app) {
// Create a new event
app.post(
  "/api/events",
  [authJwt.verifyToken],
  EventController.createEvent
);

// Edit an event by ID
app.put(
  "/api/events/:id",
  [authJwt.verifyToken],
  EventController.editEvent
);

// Delete an event by ID
app.delete(
  "/api/events/:id",
  [authJwt.verifyToken],
  EventController.deleteEvent
);

// Get a list of all events
app.get("/api/events", EventController.getAllEvents);

app.get("/api/events/:id", EventController.getEventById);

};
