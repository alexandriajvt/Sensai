import React, { useState, useEffect } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';


const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  approveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontSize: '16px',
  },
};

const EventApprovalDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve user authentication data
  const authUser = useAuthUser();
  const user = authUser;
  const userRole = user?.role;

  // Fetch pending events (Runs on first render)
  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found. Please log in.');

        const response = await fetch('http://localhost:5001/api/events/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error fetching events: ${response.statusText}`);
        }

        const data = await response.json();
        setPendingEvents(data.events || []); // Ensure events are always an array
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingEvents();
  }, []);

  // Restrict access AFTER hooks (Hooks must run first)
  if (!user || userRole !== 'admin') {
    return <p style={{ color: 'red' }}>Access Denied: You do not have permission to view this page.</p>;
  }

  // Function to approve event
  const approveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await fetch(`http://localhost:5001/api/events/${eventId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to approve event: ${response.statusText}`);
      }

      alert('Event approved successfully!');
      setPendingEvents(prevEvents => prevEvents.filter(event => event.id !== eventId)); // Remove approved event
    } catch (error) {
      setError(error.message);
    }
  };

  const rejectEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in.');
  
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to reject event: ${response.statusText}`);
      }
  
      alert('Event rejected successfully!');
      setPendingEvents(prevEvents => prevEvents.filter(event => event.id !== eventId)); // Remove rejected event
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Event Approval Dashboard</h1>

      {loading && <p>Loading pending events...</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
      {!loading && pendingEvents.length === 0 && <p>No pending events to approve.</p>}

      {pendingEvents.length > 0 && (
        <form style={styles.form}>
          {pendingEvents.map(event => (
            <div key={event.id} style={styles.group}>
              <label style={styles.label}>{event.title}</label>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <div style={styles.buttonGroup}>
                <button style={styles.approveButton} onClick={() => approveEvent(event.id, 'approve')}>Approve</button>
                <button style={styles.rejectButton} onClick={() => rejectEvent(event.id, 'reject')}>Reject</button>
              </div>
            </div>
          ))}
        </form>
      )}
    </div>
  );
};

export default EventApprovalDashboard;
