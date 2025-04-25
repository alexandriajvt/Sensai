import React, { useState } from 'react';

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

// Example fixed list of interests (could later fetch dynamically from backend)
const availableInterests = [
  'Programming',
  'Music',
  'Sports',
  'Art',
  'Networking',
  'Gaming',
  'Volunteering'
];

function ProfilePageComponent() {
  const [name, setName] = useState('');
  const [jNumber, setJNumber] = useState('');
  const [major, setMajor] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleCheckboxChange = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)  // Remove if already selected
        : [...prev, interest]                 // Add if not selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Assuming token is stored there

    const interestsPayload = selectedInterests.map((i) => i.toLowerCase());

    try {
      await fetch('http://localhost:5001/api/users/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ interests: interestsPayload })
      });

      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to your Profile Page</h1>
      <p style={{ textAlign: 'center' }}>
        Here you can enter basic details and your interests.
      </p>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.group}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>J Number</label>
          <input
            type="text"
            style={styles.input}
            value={jNumber}
            onChange={(e) => setJNumber(e.target.value)}
            placeholder="J00123456"
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Major</label>
          <input
            type="text"
            style={styles.input}
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="Your major"
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Select Your Interests</label>
          <div style={styles.checkboxGroup}>
            {availableInterests.map((interest) => (
              <label key={interest} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest)}
                  onChange={() => handleCheckboxChange(interest)}
                />
                {interest}
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
