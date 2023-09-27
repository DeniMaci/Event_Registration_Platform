// AttendeeList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AttendeeList({ match }) {
  const eventId = match.params.eventId;
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    // Fetch attendees for the event when the component mounts
    axios.get(`/api/events/attendees/${eventId}`)
      .then((response) => {
        setAttendees(response.data);
      })
      .catch((error) => {
        console.error('Error fetching attendees:', error);
      });
  }, [eventId]);

  return (
    <div>
      <h1>Attendee List</h1>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id}>
            <p>Name: {attendee.name}</p>
            <p>Email: {attendee.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendeeList;
