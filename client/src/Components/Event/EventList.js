import React, { Component } from "react";
import EventService from "../../Services/EventService";
import AuthService from '../../Services/AuthService';
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import './EventList.css'

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      searchTitle: "",
    };
  }

  componentDidMount() {
    this.fetchEvents();
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
          onClick: () => { }
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
      })
      .catch((error) => {
        console.error("Error registering for event:", error);
      });
  }

  renderAttendees(attendees) {
    return (
      <div>
        <h5>Attendees:</h5>
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee.id}>{attendee.username}</li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const { events, searchTitle } = this.state;
    const currentUser = AuthService.getCurrentUser();

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name, Description, or Location"
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
          {currentUser && (currentUser.roleId === 3 || currentUser.roleId === 2) && (
            <Link to='/events/create' className="btn btn-success">Add</Link>
          )}
          
          <ul className="list-group">
            {events.map((event) => (
              <li key={event.id} className="list-group-item">
                <h3>{event.eventName}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>

                {currentUser && (currentUser.roleId === 3 || currentUser.roleId === 2) && (
                  <div>
                    <button
                      className="btn btn-danger"
                      onClick={() => this.handleDeleteClick(event.id)}
                    >
                      Delete
                    </button>
                    <Link to={`/events/edit/${event.id}`} className="btn btn-warning">
                      Edit
                    </Link>
                  </div>
                )}

                {currentUser && currentUser.roleId === 1 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => this.handleRegisterClick(event.id)}
                  >
                    Register
                  </button>
                )}

                {currentUser && (currentUser.roleId === 3 || currentUser.roleId === 2) && event.attendees && (
                  this.renderAttendees(event.attendees)
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default EventList;
