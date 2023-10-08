const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config()
const app = express()

var corsOptions = {
  origin: "http://localhost:4001"
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const db = require('./Models')
const Role = db.Role;

// db.sequelize.sync();
// force: true will drop the table if it already exists
 db.sequelize.sync({force: true}).then(() => {
     console.log('Drop and Resync Database with { force: true }');
     initial();
   });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Event Registration Platform." });
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
}