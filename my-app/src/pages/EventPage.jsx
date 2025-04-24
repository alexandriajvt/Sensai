//Displays upcoming events 
// Only organizers see the event creation form 
// Retrieves events from /api/events
// src/pages/EventPage.jsx

//import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import EventCreationForm from '../components/EventCreationForm';

const EventPage = () => {
    const authUser = useAuthUser;
    const userRole = authUser()?.role; // Safely get the role

    console.log("Auth User Data:", authUser());
  
    return (
      <div>
  
        {/* Show event form only if the user is an organizer */}
        {userRole === 'organizer' ? (
          <>
            <EventCreationForm />
          </>
        ) : (
          <p>You must be an organizer to create events.</p>
        )}
      </div>
    );
  };
  
  export default EventPage;