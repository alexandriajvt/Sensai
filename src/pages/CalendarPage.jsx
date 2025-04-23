import React from 'react';
import Calendar from '../components/Calendar';
//import EventList from '../components/EventList';
//import { Link } from 'react-router-dom';
//import './CalendarPage.css';

// Dummy events (later, replace with real data)
const events = [
  { id: 1, name: "Campus Meeting", date: "2025-04-01" },
  { id: 2, name: "Club Fair", date: "2025-04-05" }
];

function CalendarPage() {
  return (
    <div className="calendar-page">
      <h1>Event Calendar</h1>
      {/* <ul>
        {events.map(event => (
          <li key={event.id}>
            <Link to={`/event/${event.id}`}>{event.name} - {event.date}</Link>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
export default CalendarPage;