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
        const registrationPromises = events.map((event) => {
          return EventService.isUserRegisteredForEvent(event.id);
        });
  
        Promise.all(registrationPromises)
          .then((registrationResponses) => {
            const updatedEvents = events.map((event, index) => ({
              ...event,
              isRegistered: registrationResponses[index].data.isRegistered,
            }));
  
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

  render() {
    const { events, searchTitle, currentUser, attendeesData, usersData, } = this.state;

    const filteredEvents = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchTitle.toLowerCase())
    );
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
            {filteredEvents.map((event) => (
            <li key={event.id} className="list-group-item">
            <h3>{event.eventName}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>

            {event.isRegistered ? (
            <button className="btn btn-primary" disabled>
                 Registered
            </button>
             ) : (
            <button
                className="btn btn-primary"
                onClick={() => this.handleRegisterClick(event.id)}
                >
                     Register
            </button>
    )}
  </li>
    ))}
  </ul>
)}

          {this.isEventOrganizerOrAdmin() && (
            <ul className="list-group">
              {filteredEvents.map((event) => (
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
