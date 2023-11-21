const db = require("../Models");
const Event = db.Event;
const Attendee = db.Attendee;

// Create a new event
exports.createEvent = async (req, res) => {
  const { eventName, description, date, location } = req.body;
  const organizerId = req.userId;
  try {
    const event = await Event.create({
      eventName,
      description,
      date,
      location,
      organizerId,
    });
    return res.status(201).json(event);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  };
};

// Edit an existing event by ID
exports.editEvent = async (req, res) => {
  const eventId = req.params.id;
  const { eventName, description, date, location } = req.body;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    // Update event fields
    event.eventName = eventName;
    event.description = description;
    event.date = date;
    event.location = location;
    // Save the updated event
    await event.save();
    return res.status(200).json(event);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event Not Found." });
    }
    // Delete the event
    await event.destroy();
    return res.status(204).json();
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get a list of all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    return res.status(200).json(events);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event Not Found." });
    }
    return res.status(200).json(event);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;
  try {
    // Check if the user is already registered for the event
    const existingAttendee = await Attendee.findOne({ where: { eventId, userId } });
    if (existingAttendee)
      return res.status(400).json({ message: "You are already registered for this event." });
    await Attendee.create({ eventId, userId });
    return res.status(201).json({ message: "Registration successful." });
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.isUserRegisteredForEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;
  try {
    const existingAttendee = await Attendee.findOne({ where: { eventId, userId } });
    if (existingAttendee)
      return res.status(200).json({ isRegistered: true });
    else
      return res.status(200).json({ isRegistered: false });
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// EventController.js
exports.getEventAttendees = async (req, res) => {
  const { eventId } = req.params;
  try {
    const attendees = await Attendee.findAll({ where: { eventId } });
    return res.status(200).json(attendees);
  }
  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


