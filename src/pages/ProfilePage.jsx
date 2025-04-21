//Allows students to set up interests, dorms, and notifications
import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

function ProfilePage(){

  const authUser = useAuthUser;
  console.log("testing from Profile")
  console.log('Auth User:', authUser());
    return(
      <div className="profile">
        <h1>Welcome to your Profile Page</h1>
        <p>Here you can enter basic details and your interests (name, j number, major, interests)</p>
      </div>
      );
  }
  export default ProfilePage;