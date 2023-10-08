import React, { Component } from "react";
import EventService from "../../Services/EventService";
import AuthService from "../../Services/AuthService";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../Event/EventList.css";

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      searchTitle: "",
      currentUser: AuthService.getCurrentUser(),
      attendeesMap: {}, // Store attendees for each event by eventId
    };
  }

  componentDidMount() {
    this.fetchEvents();
    
    this.state.events.forEach(event => {
      this.fetchAttendees(event.id);
    });
  }

  fetchEvents() {
    EventService.getAllEvents()
      .then((response) => {
        this.setState({
          events: response.data,
        });
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }

  fetchAttendees(eventId) {
    EventService.getEventAttendees(eventId)
      .then((response) => {
        const { attendeesMap } = this.state;
        attendeesMap[eventId] = response.data;
        this.setState({
          attendeesMap,
        });
      })
      .catch((error) => {
        console.error("Error fetching attendees:", error);
      });
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

  handleSearchTitleChange(e) {
    this.setState({ searchTitle: e.target.value });
  }

  handleRegisterClick(eventId) {
    EventService.registerForEvent(eventId)
      .then(() => {
        // Registration successful, update the event list
        this.fetchEvents();
        // Fetch attendees for the registered event
        this.fetchAttendees(eventId);
      })
      .catch((error) => {
        console.error("Error registering for event:", error);
      });
  }

  renderAttendees(eventId) {
    const { attendeesMap } = this.state;
    const attendees = attendeesMap[eventId] || [];

    return (
      <div>
        <h5>Attendees:</h5>
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee}>{attendee}</li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const { events, searchTitle, currentUser, attendeesMap } = this.state;
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

          <ul className="list-group">
            {events.map((event) => (
              <li key={event.id} className="list-group-item">
                <h3>{event.eventName}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>

                {currentUser &&
                (currentUser.roleId === 3 || currentUser.roleId === 2) && (
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
                )}

                {currentUser && currentUser.roleId === 1 ? (
                  attendeesMap[event.id] &&
                  attendeesMap[event.id].some(
                    (a) => a.user.id === currentUser.id
                  ) ? (
                    <button className="btn btn-secondary" disabled>
                      Registered
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => this.handleRegisterClick(event.id)}
                    >
                      Register
                    </button>
                  )
                ) : null}
                {currentUser &&
                  (currentUser.roleId === 3 || currentUser.roleId === 2 || currentUser === 1) &&
                  this.renderAttendees(event.id)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default EventList;
