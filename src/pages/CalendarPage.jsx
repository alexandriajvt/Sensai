import React from 'react';
import Calendar from '../components/Calendar';
//import EventList from '../components/EventList';

const CalendarPage = () => {
  console.log('CalendarPage component is rendering');
    return(
      <div className="calendar-page">
        <h1> My Calendar</h1>
        <Calendar />
        {/*<EventList />*/}
      </div> 
    );
};

export default CalendarPage;