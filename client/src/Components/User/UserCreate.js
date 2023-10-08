import React, { Component } from 'react';
import UserService from '../../Services/UserService';
import { withRouter } from '../../Shared/with-router';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class UserCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      roleId: 1, // Default role is 'User'
      role: 'User', // Default role name is 'User'
      successful: false,
      message: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRoleChange = (e) => {
    const roleId = e.target.value; // Get the selected roleId
    const roleName = this.getRoleNameById(roleId);
    this.setState({
      roleId: roleId, // Set the selected roleId
      role: roleName, // Include role name for display
    });
  };

  handleCreateUser = () => {
    const { username, email, password, roleId } = this.state;
    const { navigate } = this.props.router;
    confirmAlert({
      title: 'Confirm User Creation',
      message: 'Are you sure you want to create this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            UserService.createUser(username, email, password, roleId)
              .then(() => {
                this.setState({
                  successful: true,
                  message: 'User created successfully!',
                });
                // Assuming this component is rendered within a Route component
                navigate('/users'); // Navigate back to the user list page
              })
              .catch((error) => {
                this.setState({
                  successful: false,
                  message: error.response.data.message,
                });
              });
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  // Helper function to get role name by roleId
  getRoleNameById(roleId) {
    switch (roleId) {
      case '1':
        return 'User';
      case '2':
        return 'Organizer';
      case '3':
        return 'Admin';
      default:
        return '';
    }
  }

  render() {
    return (
      <div>
        <h1>Create User</h1>
        <form>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              type="text"
              className="form-control"
              id="role"
              value={this.state.roleId}
              onChange={this.handleRoleChange}
            >
              <option value="1">User</option>
              <option value="2">Organizer</option>
              <option value="3">Admin</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.handleCreateUser}
            >
              Create User
            </button>
          </div>
          {this.state.message && (
            <div
              className={
                this.state.successful ? 'alert alert-success' : 'alert alert-danger'
              }
            >
              {this.state.message}
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default withRouter(UserCreate);
