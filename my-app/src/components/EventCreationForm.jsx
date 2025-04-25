import { useState, useEffect } from 'react';

const EventCreationForm = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    interestIds: [] // Store selected interest IDs
  });

  const [availableInterests, setAvailableInterests] = useState([]); // Fetched interests
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available interests from backend
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/categories/interests');
        if (!response.ok) throw new Error('Failed to fetch interests.');
  
        const data = await response.json();
        setAvailableInterests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInterests();
  }, []);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (id) => {
    setEventData(prev => ({
      ...prev,
      interestIds: prev.interestIds.includes(id)
        ? prev.interestIds.filter(i => i !== id) // Remove if already selected
        : [...prev.interestIds, id] // Add if not selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('authToken');
  
    if (!token || token === "undefined" || token === "null") {
      alert("Authentication error: No valid token found. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}` // Ensures token is properly formatted
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

        {/* Interest Selection */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Tagged Interests</label>
          
          {loading && <p>Loading interests...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          {!loading && availableInterests.length === 0 && <p>No interests available.</p>}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {availableInterests.map(interest => (
              <label key={interest.id} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={eventData.interestIds.includes(interest.id)}
                  onChange={() => handleInterestChange(interest.id)}
                />
                {interest.name}
              </label>
            ))}
          </div>
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
