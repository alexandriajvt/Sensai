import { useState } from 'react';

const EventCreationForm = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: ''
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}` // Ensure user is authenticated
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Event submitted for approval!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", background: "#ffffff", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", fontSize: "22px", marginBottom: "15px" }}>
        Create an Event
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Title</label>
          <input 
            type="text" 
            name="title" 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }} 
            required 
          />
        </div>
  
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Description</label>
          <textarea 
            name="description" 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "5px", minHeight: "100px" }} 
          />
        </div>
  
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Location</label>
          <input 
            type="text" 
            name="location" 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }} 
          />
        </div>
  
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Date</label>
          <input 
            type="date" 
            name="date" 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }} 
            required 
          />
        </div>
  
        <button 
          type="submit" 
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "18px",
            transition: "0.3s ease-in-out"
          }}
        >
          Create Event
        </button>
      </form>
    </div>
  );
  
};

export default EventCreationForm;
