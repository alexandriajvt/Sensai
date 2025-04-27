import React from 'react';
import EventApprovalComponent from '../components/EventApprovalComponent';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

function EventApprovalPage() {
    //const auth = useAuthUser(); // Retrieve user data
  
    //const loggedInUser = auth(); // Get user object
    const loggedInUser = useAuthUser();
  
    if (!loggedInUser) {
      return <p>Loading...</p>; // Handle loading state while the user data is being retrieved
    }
  
    return (
      <div>
        <EventApprovalComponent authUserId={loggedInUser.id} />
      </div>
    );
  }
  
  export default EventApprovalPage;
  