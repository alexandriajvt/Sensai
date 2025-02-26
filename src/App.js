import './App.css';
import React from 'react';
import CalendarPage from './pages/CalendarPage';
console.log('App component is rendering');

function App() {
  return (
    <div className="App">
      <h1>App is rendering!</h1> {/* Check if this appears */}
      <CalendarPage />
    </div> 
  );
}

export default App;
