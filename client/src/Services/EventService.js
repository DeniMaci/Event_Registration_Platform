// client/Services/EventService.js
import axios from 'axios';
import authHeader from './Auth-Header';

const API_URL = 'http://localhost:4000/api/events/';

class EventService {
  createEvent(eventName, description, date, location) {
    return axios.post(
      API_URL,
      { eventName, description, date, location },
      { headers: authHeader() }
    );
  }

  editEvent(eventId, eventName, description, date, location) {
    return axios.put(
      `${API_URL}${eventId}`,
      { eventName, description, date, location },
      { headers: authHeader() }
    );
  }

  deleteEvent(eventId) {
    return axios.delete(`${API_URL}${eventId}`, { headers: authHeader() });
  }

  getAllEvents() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getEvent(eventId) {
    return axios.get(`${API_URL}${eventId}`, { headers: authHeader() });
  }
}

export default new EventService();
