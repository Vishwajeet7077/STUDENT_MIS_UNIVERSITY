// Logout.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      // Make a request to your backend logout endpoint
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) for cross-origin requests
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  useEffect(() => {
    logoutUser();
  }, []);

  
  return (
    <div>
      Logging out...
    </div>
  );
};

export default Logout;
