import React, { Component } from 'react';
import EventService from '../../Services/EventService';
import { withRouter } from '../../Shared/with-router';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class EventCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      description: '',
      date: '',
      location: '',
      successful: false,
      message: '',
      errors: {
        eventName: '',
        date: '',
        location: '',
      },
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  validateFields = () => {
    const { eventName, date, location } = this.state;
    const errors = {
      eventName: '',
      date: '',
      location: '',
    };
    let isValid = true;

    if (!eventName) {
      errors.eventName = 'Event name is required';
      isValid = false;
    }

    if (!date) {
      errors.date = 'Date is required';
      isValid = false;
    }

    if (!location) {
      errors.location = 'Location is required';
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  };

  handleCreateEvent = () => {
    if (!this.validateFields()) {
      return;
    }

    const { eventName, description, date, location } = this.state;
    const { navigate } = this.props.router;
    confirmAlert({
      title: 'Confirm Event Creation',
      message: 'Are you sure you want to create this event?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            EventService.createEvent(eventName, description, date, location)
              .then(() => {
                this.setState({
                  successful: true,
                  message: 'Event created successfully!',
                });
                // Assuming this component is rendered within a Route component
                navigate('/events'); // Navigate back to the event list page
              })
              .catch((error) => {
                this.setState({
                  successful: false,
                  message: error.response.data.message,
                });
              });
          },
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  render() {
    return (
      <div className="edit-form">
        <form>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="eventName"
              value={this.state.eventName}
              onChange={this.handleChange}
              className={`form-control ${this.state.errors.eventName ? 'is-invalid' : ''}`}
              required
            />
            {this.state.errors.eventName && (
              <div className="invalid-feedback">{this.state.errors.eventName}</div>
            )}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={this.state.date}
              onChange={this.handleChange}
              className={`form-control ${this.state.errors.date ? 'is-invalid' : ''}`}
              required
            />
            {this.state.errors.date && (
              <div className="invalid-feedback">{this.state.errors.date}</div>
            )}
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={this.state.location}
              onChange={this.handleChange}
              className={`form-control ${this.state.errors.location ? 'is-invalid' : ''}`}
              required
            />
            {this.state.errors.location && (
              <div className="invalid-feedback">{this.state.errors.location}</div>
            )}
          </div>
          <div>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.handleCreateEvent}
            >
              Create Event
            </button>
          </div>
          {this.state.message && (
            <div className={this.state.successful ? 'alert alert-success' : 'alert alert-danger'}>
              {this.state.message}
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default withRouter(EventCreate);
