import React, { Component } from "react";
import UserService from "../../Services/UserService";
import { withRouter } from '../../Shared/with-router';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class UserEdit extends Component {
  constructor(props) {
    super(props);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      currentUser: {
        id: null,
        username: "",
        email: "",
        roleId: "", 
        password: "",
        role: ""
      },
      message: ""
    };
  }

  componentDidMount() {
    const { router } = this.props;
    const userId = router.params.id;

    this.getUser(userId);
  }

  onChangeUsername(e) {
    const username = e.target.value;

    this.setState(prevState => ({
      currentUser: {
        ...prevState.currentUser,
        username: username
      }
    }));
  }

  onChangeEmail(e) {
    const email = e.target.value;

    this.setState(prevState => ({
      currentUser: {
        ...prevState.currentUser,
        email: email
      }
    }));
  }

  onChangePassword(e) {
    const password = e.target.value;

    this.setState((prevState) => ({
      currentUser: {
        ...prevState.currentUser,
        password: password,
      },
    }));
  }

  onChangeRole(e) {
    const roleId = e.target.value; // Get the selected roleId
    const roleName = this.getRoleNameById(roleId);
    this.setState(prevState => ({
      currentUser: {
        ...prevState.currentUser,
        roleId: roleId, // Set the selected roleId
        role: roleName // Include role name for display
      }
    }));
  }

  getUser(id) {
    UserService.getUser(id)
      .then(response => {
        this.setState(prevState => ({
          currentUser: {
            ...prevState.currentUser,
            ...response.data,
            password: "",
            roleId: response.data.roleId // Set the role from roleId
          }
        }));
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateUser() {
    const { navigate } = this.props.router;
    const { id, username, email, password, roleId } = this.state.currentUser;

    // Validate password length
    if (password && password.length < 6) {
      this.setState({ message: "Password must be at least 6 characters long." });
      return;
    }
    
    confirmAlert({
      title: "Confirm Update",
      message: "Are you sure you want to update this user?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            UserService.editUser(id, username, email, password, roleId)
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
          onClick: () => { }
        },
      ],
    });
  }

  deleteUser(userId) {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            UserService.deleteUser(userId)
              .then(() => {
                this.fetchUsers();
              })
              .catch((error) => {
                console.error("Error deleting user:", error);
              });
          },
        },
        {
          label: "No",
          onClick: () => { }
        },
      ],
    });
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
    const { currentUser } = this.state;
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
                  className="form-control"
                  id="username"
                  value={currentUser.username}
                  onChange={this.onChangeUsername}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={currentUser.email}
                  onChange={this.onChangeEmail}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={currentUser.password}
                  onChange={this.onChangePassword}
                />
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
            <button className="btn btn-warning" onClick={() => this.updateUser()} >
              Update
            </button>
            <button className="btn btn-danger"  onClick={ this.deleteUser } >
              Delete
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
