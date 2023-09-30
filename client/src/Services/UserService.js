import axios from 'axios';
import authHeader from './Auth-Header';

const API_URL = 'http://localhost:4000/api/';

class UserService {
  createUser(username, email, password, role) {
    return axios.post(
      API_URL + 'users',
      { username, email, password, role },
      { headers: authHeader() }
    );
  }

  editUser(userId, username, email, role) {
    return axios.put(
      `${API_URL}users/${userId}`,
      { username, email, role },
      { headers: authHeader() }
    );
  }

  deleteUser(userId) {
    return axios.delete(`${API_URL}users/${userId}`, { headers: authHeader() });
  }

  getAllUsers() {
    return axios.get(API_URL + 'users', { headers: authHeader() });
  }

  getUser(userId) {
    return axios.get(`${API_URL}users/${userId}`, { headers: authHeader() });
  }
}

export default new UserService();
