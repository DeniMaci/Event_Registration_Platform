import React, { Component } from "react";
import AuthService from "../Services/AuthService";
import "../styles/Home.css"
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: AuthService.getCurrentUser(),
    };
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="project-title">Welcome {currentUser ? currentUser.username : "Guest"}!</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
