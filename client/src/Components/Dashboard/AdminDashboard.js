// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch all events for the admin dashboard when the component mounts
    axios.get('/api/events/admin-dashboard')
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events for admin dashboard:', error);
      });
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <p>{event.eventName}</p>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
