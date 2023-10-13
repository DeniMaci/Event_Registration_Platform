const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config()
const app = express()

var corsOptions = {
  origin: "http://localhost:4001"
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const db = require('./Models');
const User = db.User;
const Role = db.Role;

// db.sequelize.sync();
// force: true will drop the table if it already exists
 db.sequelize.sync({force: true}).then(() => {
     console.log('Drop and Resync Database with { force: true }');
     initial();
   });

// routes
require('./Routes/Auth.js')(app);
require('./Routes/User.js')(app);
require('./Routes/Event.js')(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "User"
  });

  Role.create({
    id: 2,
    name: "Organizer"
  });

  Role.create({
    id: 3,
    name: "Admin"
  });

  User.create({
    id: 1,
    username: "Admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("111111", 8),
    roleId: 3
  });

  User.create({
    id: 2,
    username: "user",
    email: "user@gmail.com",
    password: bcrypt.hashSync("111111", 8),
    roleId: 1
  });

  User.create({
    id: 3,
    username: "organizer",
    email: "organizer@gmail.com",
    password: bcrypt.hashSync("111111", 8),
    roleId: 2
  });
}