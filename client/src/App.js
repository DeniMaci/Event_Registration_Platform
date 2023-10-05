import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/App.css";

import AuthService from "./Services/AuthService";

import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

import Profile from "./Components/Profile";

import EventList from "./Components/Event/EventList";
import EventCreate from "./Components/Event/EventCreate";
import EventEdit from "./Components/Event/EventEdit";

import UserList from "./Components/User/UserList";
import UserCreate from "./Components/User/UserCreate";
import UserEdit from "./Components/User/UserEdit";

import EventBus from "./Shared/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showEventOrganizerBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showEventOrganizerBoard: user.roleId === 2,
        showAdminBoard: user.roleId === 3,
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showEventOrganizerBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showEventOrganizerBoard, showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Event Registration Platform
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showEventOrganizerBoard && (
              <li className="nav-item">
                <Link to={"/eventOrganizer"} className="nav-link">
                  Event Organizer Dashboard
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/users"} className="nav-link">
                  Users
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/events"} className="nav-link">
                  Events
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            {currentUser && (
            <Route path="/events" element={<EventList />} />
            )}
            {(showAdminBoard || showEventOrganizerBoard) && (
            <Route path="/events/create" element={<EventCreate />} />
            )} 
            {(showAdminBoard || showEventOrganizerBoard) && (
            <Route path="/events/edit/:id" element={<EventEdit />} />
            )} 
            {showAdminBoard && (
              <Route path="/users" element={<UserList />} />
            )}
            {showAdminBoard && (
              <Route path="/users/create" element={<UserCreate />} />
            )}
            {showAdminBoard && (
              <Route path="/users/edit/:id" element={<UserEdit />} />
            )}
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
