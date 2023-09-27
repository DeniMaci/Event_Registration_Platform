const Event = require('../Models/Event');
const User = require('../Models/User');
const Attendee = require('../Models/Attendee');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'username'],
        },
      ],
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
};

const getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'attendees',
          attributes: ['id', 'username'],
          through: { attributes: [] }, // Exclude Attendee association attributes
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve event' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { eventName, description, date, location } = req.body;
    const organizerId = req.user.id; // Assuming you have user authentication in place

    const event = await Event.create({
      eventName,
      description,
      date,
      location,
      organizerId,
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { eventName, description, date, location } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.eventName = eventName;
    event.description = description;
    event.date = date;
    event.location = location;

    await event.save();

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id; // Assuming you have user authentication in place

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the user is already registered for the event
    const existingAttendee = await Attendee.findOne({
      where: { eventId, userId },
    });

    if (existingAttendee) {
      return res.status(400).json({ error: 'User is already registered for this event' });
    }

    // Create a new Attendee record to register the user for the event
    const attendee = await Attendee.create({
      eventId,
      userId,
    });

    res.status(201).json({ message: 'User registered for the event successfully', attendee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user for the event' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
};