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
    this.deleteEvent = this.deleteEvent.bind(this);

    this.state = {
      currentEvent: {
        id: null,
        eventName: "",
        description: "",
        date: "",
        location: ""
      },
      message: ""
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
      }
    }));
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState(prevState => ({
      currentEvent: {
        ...prevState.currentEvent,
        description: description
      }
    }));
  }

  onChangeDate(e) {
    const date = e.target.value;

    this.setState(prevState => ({
      currentEvent: {
        ...prevState.currentEvent,
        date: date
      }
    }));
  }

  onChangeLocation(e) {
    const location = e.target.value;

    this.setState(prevState => ({
      currentEvent: {
        ...prevState.currentEvent,
        location: location
      }
    }));
  }

  getEvent(id) {
    EventService.getEvent(id)
      .then(response => {
        this.setState({
          currentEvent: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateEvent() {
    const { navigate } = this.props.router;
    confirmAlert({
      title: "Confirm Update",
      message: "Are you sure you want to update this event?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            EventService.editEvent(
              this.state.currentEvent.id,
              this.state.currentEvent.eventName,
              this.state.currentEvent.description,
              this.state.currentEvent.date,
              this.state.currentEvent.location
            )
            .then((response) => {
              console.log(response.data);
              // Assuming this component is rendered within a Route component
              navigate("/events"); // Navigate back to the event list page
            })
              .catch((e) => {
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

  deleteEvent(eventId) {
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

  render() {
    const { currentEvent } = this.state;

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
                  className="form-control"
                  id="eventName"
                  value={currentEvent.eventName}
                  onChange={this.onChangeEventName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentEvent.description}
                  onChange={this.onChangeDescription}
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={currentEvent.date}
                  onChange={this.onChangeDate}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={currentEvent.location}
                  onChange={this.onChangeLocation}
                />
              </div>
            </form>
            <button className="btn btn-warning" onClick={() => this.updateEvent()} >
              Update
            </button>
            <button className="btn btn-danger"  onClick={ this.deleteEvent } >
              Delete
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
