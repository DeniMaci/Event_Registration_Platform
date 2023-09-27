import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserDelete = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details by ID from your backend API and confirm deletion
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleDelete = async () => {
    try {
      // Send a DELETE request to delete the user
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // User deleted successfully, you can redirect or show a success message
        console.log('User deleted successfully');
        navigate.push('/users'); // Redirect to users list page
      } else {
        // Deletion failed, handle the error (e.g., display an error message)
        console.error('User deletion failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Delete User</h2>
      {user ? (
        <div>
          <p>ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          {/* Display additional user information here */}
          <button onClick={handleDelete}>Delete User</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDelete;
