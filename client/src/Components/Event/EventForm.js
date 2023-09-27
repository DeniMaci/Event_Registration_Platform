import React, { useState } from 'react';
import axios from 'axios';

function EventForm() {
  const [eventData, setEventData] = useState({
    eventName: '',
    description: '',
    date: '',
    location: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a POST request to create the event
    axios.post('/api/events', eventData)
      .then((response) => {
        // Handle success, maybe redirect to EventList or show a success message
      })
      .catch((error) => {
        console.error('Error creating event:', error);
      });
  };

  return (
    <div>
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name:</label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">Create Event</button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
