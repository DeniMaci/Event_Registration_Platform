import axios from 'axios';
import authHeader from './Auth-Header';

const API_URL = 'http://localhost:4000/api/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'allUsers');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getEventOrganizerBoard() {
    return axios.get(API_URL + 'eventOrganizer', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
