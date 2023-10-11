import axios from "axios";
import authHeader from './Auth-Header';

const API_URL = "http://localhost:4000/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("User", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("User");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('User'));;
  }

  updateProfile(currentUser, newPassword) {
    return axios.put(API_URL + "update-profile", {
      username: currentUser.username,
      email: currentUser.email,
      currentPassword: currentUser.currentPassword, // Include the current password
      newPassword: newPassword, // Include the new password if changed
    }, { headers: authHeader() });
  }

}

export default new AuthService();
