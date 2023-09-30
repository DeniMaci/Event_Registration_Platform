// Models/Event.js
module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define("Event", {
    eventName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
    },
  });

  return Event;
};
