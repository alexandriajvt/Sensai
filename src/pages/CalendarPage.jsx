// CalendarPage.jsx
import React from 'react';
import CalendarComponent from '../components/Calendar'; // Adjust path as needed

const CalendarPage = () => {
  const events = [
    {
      id: 1,
      title: 'Team Meeting',
      start: new Date(2025, 2, 29, 10, 0), // March 29, 2025, 10:00 AM
      end: new Date(2025, 2, 29, 12, 0),  // March 29, 2025, 12:00 PM
      allDay: false,
    },
    {
      id: 2,
      title: 'Project Deadline',
      start: new Date(2025, 2, 30),
      end: new Date(2025, 2, 30),
      allDay: true,
    },
  ];

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>My Calendar</h1>
      <CalendarComponent events={events} />
    </div>
  );
};

export default CalendarPage;