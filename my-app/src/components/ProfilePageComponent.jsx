//ProfilePageComponent.jsx
import React, { useState, useEffect } from 'react';
//import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; // Ensure authentication integration

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  heading: {
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem'
  },
  section: {
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee'
  },
  sectionHeading: {
    color: '#1a237e',
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #1a237e'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  label: {
    fontWeight: 600,
    color: '#333',
    fontSize: '1rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    color: '#333'
  },
  submitButton: {
    backgroundColor: '#1a237e',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '1rem'
  }
};


function ProfilePageComponent({ authUserId }) {
  const [name, setName] = useState('');
  const [jNumber, setJNumber] = useState('');
  const [major, setMajor] = useState('');
  const [interests, setInterests] = useState([]); // Interests fetched from backend
  //const [selectedInterests, setSelectedInterests] = useState([]); // Selected interests

  // Fetch available interests and user's current selections from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Ensure token exists
        const interestsResponse = await fetch('http://localhost:5001/api/categories/interests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userResponse = await fetch(`http://localhost:5001/api/users/${authUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const interestsData = await interestsResponse.json();
        const userData = await userResponse.json();

        // Prefill user information
        setName(userData.name || '');
        setJNumber(userData.student_id || '');
        setMajor(userData.major || '');

        setInterests(
          interestsData.map(interest => ({
            id: interest.id,
            name: interest.name,
            isSelected: userData.interests.some(i => i.id === interest.id) // Pre-select interests
          }))
        );
      } catch (error) {
        console.error('Failed to fetch interests or user info:', error);
      }
    };

    fetchData();
  }, [authUserId]);

  const handleInterestToggle = (id) => {
    setInterests(prev =>
      prev.map(interest => interest.id === id
        ? { ...interest, isSelected: !interest.isSelected }
        : interest
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedInterestIds = interests
      .filter(interest => interest.isSelected)
      .map(interest => interest.id);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5001/api/users/${authUserId}/interests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ interestIds: selectedInterestIds })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Interests saved successfully!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving interests:', error);
      alert('Failed to save interests.');
    }
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to your Profile Page</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.group}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>J Number</label>
          <input
            type="text"
            value={jNumber}
            onChange={(e) => setJNumber(e.target.value)}
            placeholder="J00123456"
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Major</label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="Your major"
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Select Your Interests</label>
          <div style={styles.checkboxGroup}>
            {interests.map(interest => (
              <label key={interest.id}>
                <input
                  type="checkbox"
                  checked={interest.isSelected}
                  onChange={() => handleInterestToggle(interest.id)}
                />
                {interest.name}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" style={styles.submitButton}>Save</button>
      </form>
    </div>
  );
}

export default ProfilePageComponent;