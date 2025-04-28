//Allows students to set up interests, dorms, and notifications
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; // Ensure authentication integration

import React, { useEffect, useState } from 'react';import './ProfilePage.css';
import ProfilePageComponent from '../components/ProfilePageComponent';
import ErrorBoundary from '../ErrorBoundary';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
const ProfilePage = () => {
  const authHeader = useAuthHeader();
  //console.log('Authorization header:', authHeader);
  const currentUser = useAuthUser(); // Extract basic user informationz; name,email,role,id
  const [userData, setUserData] = useState(null); // Store full user profile
  const [loading, setLoading] = useState(true);
  //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6Im9yZ2FuaXplciIsImlhdCI6MTc0NTg2MDEwNiwiZXhwIjoxNzQ1ODYzNzA2fQ.ZjrlSBJ2ckRHJc73edzL8ag0T6PFmHXKzOvl0WmmgWo';

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser && currentUser.id) {
        try {
          const response = await fetch(`http://localhost:5001/api/users/${currentUser.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader,// Use the token from authHeader
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data.');
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user profile:', error.message);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchUserProfile();
  }, [currentUser, authHeader]); // Include authHeader in the dependency array
  ;

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <ErrorBoundary>
        {/* Pass authenticated user ID as a prop */}
        <ProfilePageComponent userId={currentUser.id} userData={userData} />
      </ErrorBoundary>
    </div>
  );
};

export default ProfilePage;