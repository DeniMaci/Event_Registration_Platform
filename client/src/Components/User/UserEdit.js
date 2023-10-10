import React, { Component } from "react";
import UserService from "../../Services/UserService";
import { withRouter } from "../../Shared/with-router";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { isEmail } from "validator"; // Import validation functions

class UserEdit extends Component {
  constructor(props) {
    super(props);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);

    this.state = {
      currentUser: {
        id: null,
        username: "",
        email: "",
        roleId: "",
        role: "",
      },
      message: "",
      initialUsername: "", // Store the initial username
      initialEmail: "", // Store the initial email
      errors: {
        username: "",
        email: "",
      }, // Add errors object for validation errors
      existingUsernames: [], // Array to store existing usernames
      existingEmails: [], // Array to store existing emails
    };
  }

  componentDidMount() {
    const { router } = this.props;
    const userId = router.params.id;

    // Fetch existing usernames and emails and store them in state
    UserService.getAllUsers()
      .then((response) => {
        const existingUsernames = response.data.map((user) => user.username);
        const existingEmails = response.data.map((user) => user.email);
        this.setState({ existingUsernames, existingEmails });
      })
      .catch((e) => {
        console.log(e);
      });

    this.getUser(userId);
  }

  onChangeUsername(e) {
    const username = e.target.value;

    this.setState((prevState) => ({
      currentUser: {
        ...prevState.currentUser,
        username: username,
      },
    }));
  }

  onChangeEmail(e) {
    const email = e.target.value;

    this.setState((prevState) => ({
      currentUser: {
        ...prevState.currentUser,
        email: email,
      },
    }));
  }

  onChangeRole(e) {
    const roleId = e.target.value; // Get the selected roleId
    const roleName = this.getRoleNameById(roleId);
    this.setState((prevState) => ({
      currentUser: {
        ...prevState.currentUser,
        roleId: roleId, // Set the selected roleId
        role: roleName, // Include role name for display
      },
    }));
  }

  getUser(id) {
    UserService.getUser(id)
      .then((response) => {
        const { username, email } = response.data;
        this.setState((prevState) => ({
          currentUser: {
            ...prevState.currentUser,
            ...response.data,
            roleId: response.data.roleId, // Set the role from roleId
          },
          initialUsername: username, // Store the initial username
          initialEmail: email, // Store the initial email
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateUser() {
    const { navigate } = this.props.router;
    const { initialUsername, initialEmail } = this.state
    const { id, username, email, roleId } = this.state.currentUser;

    // Client-side validation
    const errors = {};
    
    // Check if the user has made any changes to username or email
    if (username !== initialUsername) {
      if (!username || username.length < 3) {
        errors.username = "Username must be at least 3 characters long";
      }
      if (this.state.existingUsernames.includes(username)) {
        errors.username = "Username is already in use";
      }
    }

    if (email !== initialEmail) {
      if (!isEmail(email)) {
        errors.email = "Invalid email format";
      }
      if (this.state.existingEmails.includes(email)) {
        errors.email = "Email is already in use";
      }
    }

    this.setState({ errors });

    if (Object.values(errors).every((error) => !error)) {
      // No validation errors, proceed with update
      confirmAlert({
        title: "Confirm Update",
        message: "Are you sure you want to update this user?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              UserService.editUser(id, username, email, roleId)
                .then((response) => {
                  console.log(response.data);
                  navigate("/users"); // Navigate back to the user list page
                })
                .catch((e) => {
                  console.log(e);
                });
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
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

  render() {
    const { currentUser, errors } = this.state;
    return (
      <div>
        {currentUser ? (
          <div className="edit-form">
            <h4>Edit User</h4>
            <form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? "is-invalid" : ""}`}
                  id="username"
                  value={currentUser.username}
                  onChange={this.onChangeUsername}
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  value={currentUser.email}
                  onChange={this.onChangeEmail}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  type="text"
                  className="form-control"
                  id="role"
                  value={currentUser.roleId} // Updated to use roleId
                  onChange={this.onChangeRole}
                >
                  <option value="1">User</option>
                  <option value="2">Organizer</option>
                  <option value="3">Admin</option>
                </select>
              </div>
            </form>
            <button
              className="btn btn-warning"
              onClick={() => this.updateUser()}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please wait...</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(UserEdit);
