// CalendarPage.jsx
import React from 'react';
import Calendar from '../../my-app/src/components/Calendar';
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
    <div>
      <h1 style={{ textAlign: 'center' }}>My Calendar</h1>
      <CalendarComponent events={events} />
    </div>
  );
};

export default CalendarPage;