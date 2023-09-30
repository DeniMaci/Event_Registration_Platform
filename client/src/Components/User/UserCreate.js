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
      roles: ['user'], // Default role is 'user'
      successful: false,
      message: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRoleChange = (event) => {
    const { value } = event.target;
    // To allow multiple role selection, we'll use an array to store roles
    this.setState((prevState) => ({
      roles: prevState.roles.includes(value)
        ? prevState.roles.filter((role) => role !== value)
        : [...prevState.roles, value],
    }));
  };

  handleCreateUser = () => {
    const { username, email, password, roles } = this.state;
    const { navigate } = this.props.router;
    confirmAlert({
      title: 'Confirm User Creation',
      message: 'Are you sure you want to create this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            UserService.createUser(username, email, password, roles)
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
            <label>Roles</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="roles"
                  value="user"
                  checked={this.state.roles.includes('user')}
                  onChange={this.handleRoleChange}
                />{' '}
                User
              </label>
              <label>
                <input
                  type="checkbox"
                  name="roles"
                  value="eventOrganizer"
                  checked={this.state.roles.includes('eventOrganizer')}
                  onChange={this.handleRoleChange}
                />{' '}
                Event Organizer
              </label>
              <label>
                <input
                  type="checkbox"
                  name="roles"
                  value="admin"
                  checked={this.state.roles.includes('admin')}
                  onChange={this.handleRoleChange}
                />{' '}
                Admin
              </label>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.handleCreateUser}>
              Create User
            </button>
          </div>
          {this.state.message && (
            <div className={this.state.successful ? 'alert alert-success' : 'alert alert-danger'}>
              {this.state.message}
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default withRouter(UserCreate);
