import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; 

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found. Please log in.');

        const response = await fetch('http://localhost:5001/api/events/matchedEvents', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Safely parse error response
        console.error("Backend error:", errorData);
        throw new Error(errorData.error || response.statusText || 'Failed to fetch events.');
      }
        const eventData = await response.json();
        console.log('Fetched event data:', eventData); // Log parsed JSON 

        if (!eventData || !eventData.events) {
          throw new Error('Invalid response format: Missing events array.');
        }

        // Format events for react-big-calendar, ensuring proper date conversion
        const formattedEvents = eventData.events.map(event => ({
          id: event.id,
          title: event.title,
          start: moment(event.date).toDate(), // Ensures proper date parsing
          end: moment(event.date).toDate(), 
          location: event.location 
        }));

        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
        console.error("Fetch Events Error:", err); // Log the exact error
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <h2>My Events</h2>

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>Error loading events: {error}</p>}
      {events.length === 0 && !loading && !error && <p>No events found. Try adding one!</p>}
  
      {events.length > 0 && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '80vh' }}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
