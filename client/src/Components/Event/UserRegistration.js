import React, { useState } from 'react';
import axios from 'axios';

function UserRegistration({ match }) {
  const eventId = match.params.eventId;
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a POST request to register the user for the event
    axios.post(`/api/events/register/${eventId}`, userData)
      .then((response) => {
        // Handle success, maybe redirect to EventList or show a success message
      })
      .catch((error) => {
        console.error('Error registering for the event:', error);
      });
  };

  return (
    <div>
      <h1>Register for Event</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default UserRegistration;