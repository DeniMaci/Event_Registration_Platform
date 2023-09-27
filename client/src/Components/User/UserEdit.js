import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    // Add more fields as needed for editing user details
  });

  useEffect(() => {
    // Fetch user details by ID from your backend API and populate the form
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: data.username,
            email: data.email,
            role: data.role,
            // Populate additional fields here
          });
        } else {
          console.error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a PUT request to update the user details
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // User details updated successfully, you can redirect or show a success message
        console.log('User details updated successfully');
        navigate.push('/users'); // Redirect to users list page
      } else {
        // Update failed, handle the error (e.g., display an error message)
        console.error('User details update failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add additional form fields for editing */}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserEdit;
