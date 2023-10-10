import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../Services/AuthService";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: {
        username: "",
        email: "",
        roleId: "",
        currentPassword: "", // Added field for current password
        newPassword: "", // Added field for new password
      },
      isEditing: false, // Added state to track editing mode
      message: "",
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      this.setState({ redirect: "/home" });
    } else {
      this.setState({
        currentUser: {
          ...currentUser,
          currentPassword: "", // Initialize current password as empty
        },
        userReady: true,
      });
    }
  }

  // Helper function to get role name by roleId
  getRoleNameById(roleId) {
    switch (roleId) {
      case 1:
        return "User";
      case 2:
        return "Organizer";
      case 3:
        return "Admin";
      default:
        return "";
    }
  }

  // Toggle editing mode
  toggleEditing = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
      message: "", // Clear any previous messages
    }));
  };

  // Validation function for new password
  validateNewPassword = (newPassword) => {
    return newPassword.length >= 6;
  };

  // Handle input changes
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      currentUser: {
        ...prevState.currentUser,
        [name]: value,
      },
    }));
  };

  // Handle saving changes
  handleSaveChanges = () => {
    const { currentUser } = this.state;

    // Ensure required fields are not empty
    if (!currentUser.username || !currentUser.email) {
      this.setState({
        message: "Username and Email are required fields.",
      });
      return;
    }

    // Validate the new password length
    if (currentUser.newPassword && !this.validateNewPassword(currentUser.newPassword)) {
      this.setState({
        message: "New Password must be at least 6 characters long.",
      });
      return;
    }

    AuthService.updateProfile(currentUser, currentUser.newPassword)
      .then((response) => {
        this.setState({
          message: response.data.message,
          isEditing: false,
          currentUser: {
            ...currentUser,
            currentPassword: "", 
            newPassword: "", 
          },
        });
      })
      .catch((error) => {
        this.setState({
          message:
            error.response && error.response.data
              ? error.response.data.message
              : error.message,
        });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const { currentUser, userReady, isEditing, message } = this.state;

    return (
      <div className="container">
        {userReady ? (
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3>
            </header>
            <p>
              <strong>Token:</strong>{" "}
              {currentUser.accessToken.substring(0, 20)} ...{" "}
              {currentUser.accessToken.substr(
                currentUser.accessToken.length - 20
              )}
            </p>
            <p>
              <strong>Id:</strong> {currentUser.id}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {this.getRoleNameById(currentUser.roleId)}
            </p>

            {isEditing ? (
              <div>
                <h4>Edit Profile</h4>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={currentUser.username}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={currentUser.email}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentUser.currentPassword}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={currentUser.newPassword}
                    onChange={this.handleInputChange}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={this.handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <button className="btn btn-primary" onClick={this.toggleEditing}>
                  Edit Profile
                </button>
              </div>
            )}

            {message && <div className="alert alert-info">{message}</div>}
          </div>
        ) : null}
      </div>
    );
  }
}
