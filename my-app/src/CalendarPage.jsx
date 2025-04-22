import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPage.css';

const localizer = momentLocalizer(moment);

function CalendarPage() {
  const [events, setEvents] = useState([
    {
      title: 'Football Game',
      start: new Date(2024, 2, 15, 19, 0),
      end: new Date(2024, 2, 15, 22, 0),
      category: 'sports'
    },
    {
      title: 'Career Fair',
      start: new Date(2024, 2, 20, 10, 0),
      end: new Date(2024, 2, 20, 16, 0),
      category: 'career'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('New Event name:');
    if (title) {
      setEvents([
        ...events,
        {
          start,
          end,
          title,
          category: selectedCategory
        }
      ]);
    }
  };

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>JSU Event Calendar</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">All Events</option>
          <option value="sports">Sports</option>
          <option value="academic">Academic</option>
          <option value="cultural">Cultural</option>
          <option value="career">Career</option>
          <option value="social">Social</option>
        </select>
      </div>
      
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        selectable
      />
    </div>
  );
}

export default CalendarPage; 