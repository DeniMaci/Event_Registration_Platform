// models/User.js
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'organizer', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  });

  User.associate = (models) => {
    // User can organize multiple events (one-to-many relationship)
    User.hasMany(models.Event, {
      foreignKey: 'organizerId',
      as: 'organizedEvents',
    });

    // User can attend multiple events through the Attendee model (many-to-many relationship)
    User.belongsToMany(models.Event, {
      through: models.Attendee,
      foreignKey: 'userId',
      as: 'attendedEvents',
    });
  };

  return User;
};
