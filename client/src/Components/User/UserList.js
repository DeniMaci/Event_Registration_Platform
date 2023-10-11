import React, { Component } from "react";
import UserService from "../../Services/UserService";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      searchTitle: "",
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    UserService.getAllUsers()
      .then((response) => {
        this.setState({
          users: response.data,
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  handleDeleteClick(userId) {
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
          onClick: () => { },
        },
      ],
    });
  }

  handleSearchTitleChange(e) {
    this.setState({ searchTitle: e.target.value });
  }

  render() {
    const { users, searchTitle } = this.state;

    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTitle.toLowerCase())
    );

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by username"
              value={searchTitle}
              onChange={(e) => this.handleSearchTitleChange(e)}
            />
          </div>
        </div>

        {/* User List */}
        <div className="col-md-6">
          <h4>User List</h4>
          <Link to='/users/create' className="btn btn-success">Add</Link>
          <ul className="list-group">
            {filteredUsers.map((user) => (
              <li key={user.id} className="list-group-item">
                <h3>Username: {user.username}</h3>
                <p>Email: {user.email}</p>
                <p>ID: {user.id}</p>
                <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Updated At: {new Date(user.updatedAt).toLocaleDateString()}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => this.handleDeleteClick(user.id)}
                >
                  Delete
                </button>
                <Link to={`/users/edit/${user.id}`} className="btn btn-warning">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default UserList;
