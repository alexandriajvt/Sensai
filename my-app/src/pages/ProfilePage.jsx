//ProfilePage.jsx

import React from 'react';
import ProfilePageComponent from '../components/ProfilePageComponent';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

function ProfilePage() {
  //const auth = useAuthUser(); // Retrieve user data

  //const loggedInUser = auth(); // Get user object
  const loggedInUser = useAuthUser();

  if (!loggedInUser) {
    return <p>Loading...</p>; // Handle loading state while the user data is being retrieved
  }

  return (
    <div>
      <ProfilePageComponent authUserId={loggedInUser.id} />
    </div>
  );
}

export default ProfilePage;
