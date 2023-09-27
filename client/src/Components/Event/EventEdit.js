import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EventEdit({ match }) {
  const eventId = match.params.eventId;
  const [eventData, setEventData] = useState({
    eventName: '',
    description: '',
    date: '',
    location: '',
  });

  useEffect(() => {
    // Fetch event data by ID and populate the form fields
    axios.get(`/api/events/${eventId}`)
      .then((response) => {
        setEventData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching event data:', error);
      });
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a PUT request to update the event
    axios.put(`/api/events/${eventId}`, eventData)
      .then((response) => {
        // Handle success, maybe redirect to EventList or show a success message
      })
      .catch((error) => {
        console.error('Error updating event:', error);
      });
  };

  return (
    <div>
      <h1>Edit Event</h1>
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
          <button type="submit">Update Event</button>
        </div>
      </form>
    </div>
  );
}

export default EventEdit;