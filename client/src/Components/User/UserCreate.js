import React, { Component } from 'react';
import UserService from '../../Services/UserService';
import { withRouter } from '../../Shared/with-router';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: Yup.string().required('Email is required').email('Invalid email format'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  roleId: Yup.string().required('Role is required'),
});

class UserCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successful: false,
      message: '',
    };
  }

  handleCreateUser = (values, { setSubmitting }) => {
    const { navigate } = this.props.router;
    confirmAlert({
      title: 'Confirm User Creation',
      message: 'Are you sure you want to create this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            UserService.createUser(values.username, values.email, values.password, values.roleId)
              .then(() => {
                this.setState({
                  successful: true,
                  message: 'User created successfully!',
                });
                navigate('/users');
              })
              .catch((error) => {
                this.setState({
                  successful: false,
                  message: error.response.data.message,
                });
              })
              .finally(() => {
                setSubmitting(false); // Reset isSubmitting to false
              });
          },
        },
        {
          label: 'No',
          onClick: () => {
          setSubmitting(false);
        }
        },
      ],
    });
  };

  render() {
    return (
      <div>
        <h1>Create User</h1>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            roleId: '1', // Set the default role here
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            this.handleCreateUser(values, { setSubmitting });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label>Username</label>
                <Field
                  type="text"
                  name="username"
                  className="form-control"
                />
                <ErrorMessage name="username" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <Field
                  as="select"
                  name="roleId"
                  className="form-control"
                >
                  <option value="1">User</option>
                  <option value="2">Organizer</option>
                  <option value="3">Admin</option>
                </Field>
                <ErrorMessage name="roleId" component="div" className="text-danger" />
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  Create User
                </button>
              </div>
              {this.state.message && (
                <div
                  className={
                    this.state.successful ? 'alert alert-success' : 'alert alert-danger'
                  }
                >
                  {this.state.message}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default withRouter(UserCreate);
