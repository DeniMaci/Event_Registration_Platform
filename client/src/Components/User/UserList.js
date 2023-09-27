import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserList = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details by ID from your backend API
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

  return (
    <div>
      <h2>User Details</h2>
      {user ? (
        <div>
          <p>ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          {/* Display additional user information here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserList;
