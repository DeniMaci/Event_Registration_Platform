import React, { Component } from "react";
import EventService from "../../Services/EventService";
import AuthService from "../../Services/AuthService";
import UserService from "../../Services/UserService";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./EventList.css";

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      searchTitle: "",
      currentUser: AuthService.getCurrentUser(),
      attendeesData: {},
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents() {
    EventService.getAllEvents()
      .then((response) => {
        const events = response.data;
        this.setState({
          events,
        });

        // Check if the current user is an admin or event organizer
        if (this.isEventOrganizerOrAdmin()) {
          // Fetch attendees for each event
          const eventPromises = events.map((event) => {
            return EventService.getEventAttendees(event.id);
          });

          // Wait for all attendee requests to resolve
          Promise.all(eventPromises)
            .then((attendeesData) => {
              const attendeesDataMap = {};
              attendeesData.forEach((data, index) => {
                attendeesDataMap[events[index].id] = data.data;
              });

              // Fetch user data for attendees
              this.fetchUserDataForAttendees(attendeesDataMap);
            })
            .catch((error) => {
              console.error("Error fetching attendees for events:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }

  // Fetch user data for attendees
  fetchUserDataForAttendees(attendeesDataMap) {
    const userIds = Object.values(attendeesDataMap)
      .flat()
      .map((attendee) => attendee.userId);

    UserService.getUsersByIds(userIds)
      .then((userResponses) => {
        const usersData = {};
        userResponses.forEach((response) => {
          const user = response.data;
          usersData[user.id] = user;
        });

        this.setState({
          attendeesData: attendeesDataMap,
          usersData: usersData,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data for attendees:", error);
      });
  }

  isEventOrganizerOrAdmin() {
    const { currentUser } = this.state;
    return currentUser && (currentUser.roleId === 2 || currentUser.roleId === 3);
  }

  isEventOrganizer() {
    const { currentUser } = this.state;
    return currentUser && currentUser.roleId === 2;
  }

  isAdmin() {
    const { currentUser } = this.state;
    return currentUser && currentUser.roleId === 3;
  }

  handleDeleteClick(eventId) {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this event?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            EventService.deleteEvent(eventId)
              .then(() => {
                this.fetchEvents();
              })
              .catch((error) => {
                console.error("Error deleting event:", error);
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

  handleRegisterClick(eventId) {
    // Check if the user is already registered for the event
    EventService.isUserRegisteredForEvent(eventId)
      .then((response) => {
        if (response.data.isRegistered) {
          // User is already registered, show a message or disable the button
          alert("You are already registered for this event.");
        } else {
          // User is not registered, proceed with registration
          EventService.registerForEvent(eventId)
            .then(() => {
              this.fetchEvents(); // Refresh the event list
            })
            .catch((error) => {
              console.error("Error registering for event:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking registration status:", error);
      });
  }

  handleSearchTitleChange(e) {
    this.setState({ searchTitle: e.target.value });
  }

  render() {
    const {
      events,
      searchTitle,
      currentUser,
      attendeesData,
      usersData,
    } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search By Event Name"
              value={searchTitle}
              onChange={(e) => this.handleSearchTitleChange(e)}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="col-md-6">
          <h4>Event List</h4>
          {currentUser &&
            (currentUser.roleId === 3 || currentUser.roleId === 2) && (
              <Link to="/events/create" className="btn btn-success">
                Add
              </Link>
            )}
          {currentUser && currentUser.roleId === 1 && (
            <ul className="list-group">
              {events.map((event) => (
                <li key={event.id} className="list-group-item">
                  <h3>{event.eventName}</h3>
                  <p>{event.description}</p>
                  <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p>Location: {event.location}</p>

                  <button
                    className="btn btn-primary"
                    onClick={() => this.handleRegisterClick(event.id)}
                  >
                    Register
                  </button>
                </li>
              ))}
            </ul>
          )}

          {this.isEventOrganizerOrAdmin() && (
            <ul className="list-group">
              {events.map((event) => (
                <li key={event.id} className="list-group-item">
                  <h3>{event.eventName}</h3>
                  <p>{event.description}</p>
                  <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p>Location: {event.location}</p>

                  {/* Admin View */}
                  {this.isAdmin() && (
                    <div>
                      <div>
                        <button
                          className="btn btn-danger"
                          onClick={() => this.handleDeleteClick(event.id)}
                        >
                          Delete
                        </button>
                        <Link
                          to={`/events/edit/${event.id}`}
                          className="btn btn-warning"
                        >
                          Edit
                        </Link>
                      </div>

                      <h5>Attendees:</h5>
                      <ul>
                        {attendeesData[event.id] &&
                          attendeesData[event.id].map((attendee) => (
                            <li key={attendee.userId}>
                              {usersData[attendee.userId]
                                ? usersData[attendee.userId].username
                                : "Unknown User"}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* EventOrganizer View */}
                  {this.isEventOrganizer() &&
                    event.organizerId === currentUser.id && (
                      <div>
                        <div>
                          <button
                            className="btn btn-danger"
                            onClick={() => this.handleDeleteClick(event.id)}
                          >
                            Delete
                          </button>
                          <Link
                            to={`/events/edit/${event.id}`}
                            className="btn btn-warning"
                          >
                            Edit
                          </Link>
                        </div>

                        <h5>Attendees:</h5>
                        <ul>
                          {attendeesData[event.id] &&
                            attendeesData[event.id].map((attendee) => (
                              <li key={attendee.userId}>
                                {usersData[attendee.userId]
                                  ? usersData[attendee.userId].username
                                  : "Unknown User"}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                </li>
              ))}
            </ul>
          )}

          {!currentUser && (
            <div className="alert alert-info" role="alert">
              Please <Link to="/login">login</Link> to view and register for events.
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default EventList;
