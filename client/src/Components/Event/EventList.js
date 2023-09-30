import React, { Component } from "react";
import EventService from "../../Services/EventService";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

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

  render() {
    const { events, searchTitle } = this.state;
    const filteredEvents = events.filter((event) => event.eventName.toLowerCase().includes(searchTitle.toLowerCase()) || 
                                                    event.description.toLowerCase().includes(searchTitle.toLowerCase()) ||
                                                    event.location.toLowerCase().includes(searchTitle.toLowerCase()));

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
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
          <Link to='/events/create' className="btn btn-success">Add</Link>
          <ul className="list-group">
            {filteredEvents.map((event) => (
              <li key={event.id} className="list-group-item">
                <h3>{event.eventName}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => this.handleDeleteClick(event.id)}
                >
                  Delete
                </button>
                <Link to={`/events/edit/${event.id}`} className="btn btn-warning">
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

export default EventList;
