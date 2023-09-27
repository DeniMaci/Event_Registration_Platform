// db.js
const { Sequelize } = require('sequelize');
var a = require('dotenv').config(); // Load environment variables from .env file

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

// Define your Sequelize models and sync them with the database here

// Sync all models with the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Database sync failed:', err);
  });

module.exports = db;
