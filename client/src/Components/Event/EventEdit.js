import React, { Component } from "react";
import EventService from "../../Services/EventService";
import { withRouter } from '../../Shared/with-router';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.onChangeEventName = this.onChangeEventName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);

    this.state = {
      currentEvent: {
        id: null,
        eventName: "",
        description: "",
        date: "",
        location: ""
      },
      message: "",
      initialEventName: "", // Store the initial event name
      initialDescription: "", // Store the initial description
      initialDate: "", // Store the initial date
      initialLocation: "", // Store the initial location
      errors: {
        eventName: "",
        description: "",
        date: "",
        location: "",
      }, // Add errors object for validation errors
    };
  }

  componentDidMount() {
    const { router } = this.props;
    const eventId = router.params.id;

    this.getEvent(eventId);
  }

  onChangeEventName(e) {
    const eventName = e.target.value;

    this.setState(prevState => ({
      currentEvent: {
        ...prevState.currentEvent,
        eventName: eventName
      },
    }));
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState(prevState => ({
      currentEvent: {
        ...prevState.currentEvent,
        description: description
      },
    }));
  }

  onChangeDate(e) {
    const date = e.target.value;

    this.setState(prevState => ({
      currentEvent: {
        ...prevState.currentEvent,
        date: date
      },
    }));
  }

  onChangeLocation(e) {
    const location = e.target.value;

    this.setState(prevState => ({
      currentEvent: {
        ...prevState.currentEvent,
        location: location
      },
    }));
  }

  getEvent(id) {
    EventService.getEvent(id)
      .then(response => {
        this.setState({
          currentEvent: response.data,
          initialEventName: response.data.eventName,
          initialDescription: response.data.description,
          initialDate: response.data.date,
          initialLocation: response.data.location,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateEvent() {
    const { navigate } = this.props.router;
    const { id, eventName, description, date, location, initialEventName, initialDescription, initialDate, initialLocation } = this.state.currentEvent;

    // Client-side validation
    const errors = {};

    // Check if the user has made any changes to event properties
    if (eventName !== initialEventName) {
      if (!eventName) {
        errors.eventName = "Event name is required";
      }
    }

    if (description !== initialDescription) {
      if (!description) {
        errors.description = "Description is required";
      }
    }

    if (date !== initialDate) {
      if (!date) {
        errors.date = "Date is required";
      }
    }

    if (location !== initialLocation) {
      if (!location) {
        errors.location = "Location is required";
      }
    }

    this.setState({ errors });

    if (Object.values(errors).every(error => !error)) {
      // No validation errors, proceed with update
      confirmAlert({
        title: "Confirm Update",
        message: "Are you sure you want to update this event?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              EventService.editEvent(
                id,
                eventName,
                description,
                date,
                location
              )
                .then(response => {
                  console.log(response.data);
                  // Assuming this component is rendered within a Route component
                  navigate("/events"); // Navigate back to the event list page
                })
                .catch(e => {
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
  }

  render() {
    const { currentEvent, errors } = this.state;

    return (
      <div>
        {currentEvent ? (
          <div className="edit-form">
            <h4>Edit Event</h4>
            <form>
              <div className="form-group">
                <label htmlFor="eventName">Event Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.eventName ? "is-invalid" : ""}`}
                  id="eventName"
                  value={currentEvent.eventName}
                  onChange={this.onChangeEventName}
                />
                {errors.eventName && (
                  <div className="invalid-feedback">{errors.eventName}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  id="description"
                  value={currentEvent.description}
                  onChange={this.onChangeDescription}
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                  id="date"
                  value={currentEvent.date}
                  onChange={this.onChangeDate}
                />
                {errors.date && (
                  <div className="invalid-feedback">{errors.date}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  className={`form-control ${errors.location ? "is-invalid" : ""}`}
                  id="location"
                  value={currentEvent.location}
                  onChange={this.onChangeLocation}
                />
                {errors.location && (
                  <div className="invalid-feedback">{errors.location}</div>
                )}
              </div>
            </form>
            <button className="btn btn-warning" onClick={() => this.updateEvent()} >
              Update
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

export default withRouter(EditEvent);
