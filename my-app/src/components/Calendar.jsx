// Calendar.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Track clicked event
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await fetch('http://localhost:5001/api/events/matchedEvents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch events.');
      }

      const eventData = await response.json();
      if (!eventData?.events) throw new Error('Invalid response format: Missing events array.');

      const formattedEvents = eventData.events.map(event => ({
        id: event.id,
        title: event.title,
        start: moment(event.date).toDate(),
        end: moment(event.date).add(2, 'hours').toDate(),
        location: event.location,
        description: event.description || "No description provided",
        allDay: false,
        resource: event
      }));

      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div style={{ height: '85vh', padding: '20px', position: 'relative' }}>
      <h2>My Events</h2>

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && events.length === 0 && (
        <p style={{ color: 'gray' }}>
          No events found. Set your interests in your profile to discover events.
        </p>
      )}

      {!loading && events.length > 0 && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          tooltipAccessor={event => `${event.title}\nLocation: ${event.location || 'N/A'}`}
          onSelectEvent={(event) => setSelectedEvent(event)}
          style={{ height: '100%' }}
        />
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '10px',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <h3>{selectedEvent.title}</h3>
          <p><strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}</p>
          <p><strong>Location:</strong> {selectedEvent.location || "N/A"}</p>
          <p><strong>Description:</strong> {selectedEvent.description}</p>
          <button onClick={closeModal} style={{ marginTop: '10px' }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
