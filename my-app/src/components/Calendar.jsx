//Displays events in a calendar format
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the default CSS

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events }) => {

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh' }}
      />
    </div>
  );
};

export default CalendarComponent;