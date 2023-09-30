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
    this.onChangeRole = this.onChangeRole.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      currentUser: {
        id: null,
        username: "",
        email: "",
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

  onChangeRole(e) {
    const role = e.target.value;

    this.setState(prevState => ({
      currentUser: {
        ...prevState.currentUser,
        role: role
      }
    }));
  }

  getUser(id) {
    UserService.getUser(id)
      .then(response => {
        this.setState({
          currentUser: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateUser() {
    const { navigate } = this.props.router;
    confirmAlert({
      title: "Confirm Update",
      message: "Are you sure you want to update this user?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            UserService.editUser(
              this.state.currentUser.id,
              this.state.currentUser.username,
              this.state.currentUser.email,
              this.state.currentUser.role
            )
            .then((response) => {
              console.log(response.data);
              // Assuming this component is rendered within a Route component
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
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  value={currentUser.role}
                  onChange={this.onChangeRole}
                />
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
