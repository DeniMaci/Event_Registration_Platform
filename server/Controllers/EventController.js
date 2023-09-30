const db = require("../Models");
const Event = db.Event;

// Create a new event
exports.createEvent = (req, res) => {
  // Implement validation and authorization checks here
  const { eventName, description, date, location } = req.body;
  const organizerId = req.userId; // Assuming you have a middleware to extract the user's ID from the token

  Event.create({
    eventName,
    description,
    date,
    location,
    organizerId,
  })
    .then((event) => {
      res.status(201).json(event);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Edit an existing event by ID
exports.editEvent = (req, res) => {
  // Implement validation and authorization checks here
  const eventId = req.params.id; // Assuming you receive the event ID in the request parameters
  const { eventName, description, date, location } = req.body;

  Event.findByPk(eventId)
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }

      // Update event fields
      event.eventName = eventName;
      event.description = description;
      event.date = date;
      event.location = location;

      // Save the updated event
      event
        .save()
        .then(() => {
          res.status(200).json(event);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Delete an event by ID
exports.deleteEvent = (req, res) => {
  // Implement validation and authorization checks here
  const eventId = req.params.id; // Assuming you receive the event ID in the request parameters

  Event.findByPk(eventId)
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }

      // Delete the event
      event
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

// Get a list of all events
exports.getAllEvents = (req, res) => {
  // Implement authorization checks here if needed
  Event.findAll()
    .then((events) => {
      res.status(200).json(events);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get an event by ID
exports.getEventById = (req, res) => {
  const eventId = req.params.id; // Assuming you receive the event ID in the request parameters

  Event.findByPk(eventId)
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }

      // Respond with the event data
      res.status(200).json(event);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

