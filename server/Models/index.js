// db.js
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const sequelize = new Sequelize({
  dialect: 'mssql',
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../Models/User")(sequelize, Sequelize);
db.Role = require("../Models/Role")(sequelize, Sequelize);
db.Event = require("../Models/Event")(sequelize, Sequelize);

db.Role.belongsToMany(db.User, {
  through: "User_Roles"
});
db.User.belongsToMany(db.Role, {
  through: "User_Roles"
});

db.User.hasMany(db.Event, { foreignKey: 'organizerId' });
db.Event.belongsTo(db.User, { foreignKey: 'organizerId' });

db.Event.belongsToMany(db.User, {
  through: "Attendees",
  foreignKey: "eventId",
  as: "attendees",
});
db.User.belongsToMany(db.Event, {
  through: "Attendees",
  foreignKey: "userId",
  as: "attendedEvents",
});

db.ROLES = ["User", "Admin", "Organizer"];

module.exports = db;