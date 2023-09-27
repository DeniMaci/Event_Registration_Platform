// models/Event.js
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Event.associate = (models) => {
    // Each event is organized by a user (one-to-many relationship)
    Event.belongsTo(models.User, {
      foreignKey: 'organizerId',
      as: 'organizer',
    });

    // Each event can have multiple attendees (many-to-many relationship)
    Event.belongsToMany(models.User, {
      through: models.Attendee,
      foreignKey: 'eventId',
      as: 'attendees',
    });
  };

  return Event;
};
