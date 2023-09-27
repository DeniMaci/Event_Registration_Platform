const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Include routes for authentication
app.use('api/auth', require('./Routes/Auth'));

// Include routes for user-related operations
app.use('/users', require('./Routes/Users'));

// Include routes for event-related operations
app.use('/events', require('./Routes/Events'));

// Include routes for admin-related operations
app.use('/admin', require('./Routes/Admin'));

app.listen(3000, () => {
  console.log('Server listening on port:', 3000);
});
