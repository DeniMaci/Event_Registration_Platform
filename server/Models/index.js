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

db.Role.belongsToMany(db.User, {
  through: "user_roles"
});
db.User.belongsToMany(db.Role, {
  through: "user_roles"
});

db.ROLES = ["User", "Admin", "Organizer"];

module.exports = db;
