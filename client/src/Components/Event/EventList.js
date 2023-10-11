import React, { Component } from "react";
import EventService from "../../Services/EventService";
import AuthService from "../../Services/AuthService";
import UserService from "../../Services/UserService";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../../styles/Events/EventList.css";

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      searchTitle: "",
      currentUser: AuthService.getCurrentUser(),
      attendeesData: {},
      attendeesDropdown: null, // Store the event ID for the currently open attendees dropdown
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents() {
    EventService.getAllEvents()
      .then((response) => {
        const events = response.data;

        // Create an array of promises to check registration status for each event
        const registrationPromises = events.map((event) => {
          return EventService.isUserRegisteredForEvent(event.id);
        });

        // Wait for all registration status checks to resolve
        Promise.all(registrationPromises)
          .then((registrationResponses) => {
            // Map registration status to events
            const updatedEvents = events.map((event, index) => ({
              ...event,
              isRegistered: registrationResponses[index].data.isRegistered,
            }));

            // Fetch attendees for each event only if the user is not a regular user
            if (!this.isUser()) {
              const eventPromises = updatedEvents.map((event) => {
                return EventService.getEventAttendees(event.id);
              });

              // Wait for all attendee requests to resolve
              Promise.all(eventPromises)
                .then((attendeesData) => {
                  const attendeesDataMap = {};
                  attendeesData.forEach((data, index) => {
                    attendeesDataMap[updatedEvents[index].id] = data.data;
                  });

                  // Fetch user data for attendees
                  this.fetchUserDataForAttendees(attendeesDataMap);
                })
                .catch((error) => {
                  console.error("Error fetching attendees for events:", error);
                });
            }

            this.setState({
              events: updatedEvents,
            });
          })
          .catch((error) => {
            console.error("Error checking registration status:", error);
          });
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

        const updatedUsersData = { ...usersData };
        Object.keys(attendeesDataMap).forEach((eventId) => {
          const attendees = attendeesDataMap[eventId];
          attendees.forEach((attendee) => {
            const userId = attendee.userId;
            if (!updatedUsersData[userId]) {
              return;
            }
            if (!updatedUsersData[userId].registeredEvents) {
              updatedUsersData[userId].registeredEvents = [];
            }
            updatedUsersData[userId].registeredEvents.push(Number(eventId));
          });
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

  isUser() {
    const { currentUser } = this.state;
    return currentUser && currentUser.roleId === 1;
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
          this.setState((prevState) => {
            const updatedEvents = prevState.events.map((event) => {
              if (event.id === eventId) {
                return { ...event, isRegistered: true };
              }
              return event;
            });
            return { events: updatedEvents };
          });
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

  isUserRegistered(eventId, currentUser) {
    if (!currentUser || !Array.isArray(currentUser.registeredEvents)) {
      return false;
    }
    return currentUser.registeredEvents.includes(eventId);
  }

  handleSearchTitleChange(e) {
    this.setState({ searchTitle: e.target.value });
  }

  // Toggle attendees dropdown for an event
  toggleAttendeesDropdown(eventId) {
    this.setState((prevState) => ({
      attendeesDropdown: prevState.attendeesDropdown === eventId ? null : eventId,
    }));
  }

  render() {
    const { events, searchTitle, currentUser, attendeesData, usersData, attendeesDropdown } = this.state;

    const filteredEvents = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchTitle.toLowerCase())
    );

    return (
      <div className="list container">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search By Event Name"
            value={searchTitle}
            onChange={(e) => this.handleSearchTitleChange(e)}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button">
              Search
            </button>
          </div>
        </div>

        <div className="row">
          {this.isUser() && (
            <div className="d-flex flex-wrap justify-content-between">
              {filteredEvents.map((event) => (
                <div key={event.id} className="col-md-4 mb-4">
                  <div className="list-group-item">
                    <h5 className="card-title">{event.eventName}</h5>
                    <p className="card-text">{event.description}</p>
                    <p className="card-text">Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p className="card-text">Location: {event.location}</p>
                    {event.isRegistered ? (
                      <button className="btn btn-primary" disabled>
                        Registered
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={() => this.handleRegisterClick(event.id)}>
                        Register
                      </button>
                    )}
                    {/* Button to toggle attendees dropdown */}
                    <button className="btn btn-secondary" onClick={() => this.toggleAttendeesDropdown(event.id)}>
                      {attendeesDropdown === event.id ? "Hide Attendees" : "Show Attendees"}
                    </button>
                    {/* Attendees dropdown */}
                    {attendeesDropdown === event.id && (
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id={`attendeesDropdown-${event.id}`}
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Attendees
                        </button>
                        <div className="dropdown-menu" aria-labelledby={`attendeesDropdown-${event.id}`}>
                          {attendeesData[event.id] &&
                            attendeesData[event.id].map((attendee) => (
                              <p key={attendee.userId} className="dropdown-item">
                                {usersData[attendee.userId]
                                  ? usersData[attendee.userId].username
                                  : "Unknown User"}
                              </p>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {this.isEventOrganizerOrAdmin() && (
          <ul className="list-group">
            {filteredEvents.map((event) => (
              <li key={event.id} className="list-group-item">
                <h3>{event.eventName}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>
                {this.isAdmin() && (
                  <div>
                    <div>
                      <button className="btn btn-danger" onClick={() => this.handleDeleteClick(event.id)}>
                        Delete
                      </button>
                      <Link to={`/events/edit/${event.id}`} className="btn btn-warning">
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
                {this.isEventOrganizer() && event.organizerId === currentUser.id && (
                  <div>
                    <div>
                      <button className="btn btn-danger" onClick={() => this.handleDeleteClick(event.id)}>
                        Delete
                      </button>
                      <Link to={`/events/edit/${event.id}`} className="btn btn-warning">
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
    );
  }
}

export default EventList;
