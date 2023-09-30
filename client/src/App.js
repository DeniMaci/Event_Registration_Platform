import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./Services/AuthService";

import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import BoardUser from "./Components/Dashboard/UserDashboard";
import BoardEventOrganizer from "./Components/Dashboard/EventOrganizerDashboard";
import BoardAdmin from "./Components/Dashboard/AdminDashboard";
import EventList from "./Components/Event/EventList";
import EventCreate from "./Components/Event/EventCreate";
import EventEdit from "./Components/Event/EventEdit";

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
        showEventOrganizerBoard: user.roles.includes("ROLE_ORGANIZER"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
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
                <Link to={"/admin"} className="nav-link">
                  Admin Dashboard
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User Dashboard
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
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/eventOrganizer" element={<BoardEventOrganizer />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/create" element={<EventCreate />} />
            <Route path="/events/edit/:id" element={<EventEdit />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
