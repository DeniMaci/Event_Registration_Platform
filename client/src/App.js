// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventList from './Components/Event/EventList';
import EventForm from './Components/Event/EventForm';
import EventEdit from './Components/Event/EventEdit';
import EventDelete from './Components/Event/EventDelete';
import UserRegistration from './Components/Event/UserRegistration';
import AttendeeList from './Components/Event/AttendeeList';

import AdminDashboard from './Components/Dashboard/AdminDashboard';

import Register from './Components/Auth/Register.js';
import Login from './Components/Auth/Login';

import UsersList from './Components/User/UsersList';
import UserList from './Components/User/UserList';
import UserEdit from './Components/User/UserEdit';
import UserDelete from './Components/User/UserDelete';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={ <EventList/> } />
          <Route path="/events/create" element={ <EventForm/> } />
          <Route path="/events/edit/:eventId" element={ <EventEdit/> } />
          <Route path="/events/delete/:eventId" element={ <EventDelete/> } />
          <Route path="/events/register/:eventId" element={ <UserRegistration/> } />
          <Route path="/events/attendees/:eventId" element={ <AttendeeList/> } />

          <Route path="auth/register" element={ <Register/> } />
          <Route path="/login" element={ <Login/> } />

          <Route path="/dashboard" element={ <AdminDashboard/> } />

          <Route path="/users" element={ <UsersList/> } />
          <Route path="/users/:userId" element={ <UserList/> } />
          <Route path="/users/edit/:userId" element={ <UserEdit/> } />
          <Route path="/users/delete/:userId" element={ <UserDelete/> } />
          </Routes>
      </div>
    </Router>
  );
}

export default App;