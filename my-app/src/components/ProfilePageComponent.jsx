import React from 'react';

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

function ProfilePageComponent() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to your Profile Page</h1>
      <p style={{ textAlign: 'center' }}>
        Here you can enter basic details and your interests.
      </p>
      <form style={styles.form}>
        <div style={styles.group}>
          <label style={styles.label}>Name</label>
          <input type="text" style={styles.input} placeholder="Enter your name" />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>J Number</label>
          <input type="text" style={styles.input} placeholder="J00123456" />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Major</label>
          <input type="text" style={styles.input} placeholder="Your major" />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Interests</label>
          <input type="text" style={styles.input} placeholder="E.g. Programming, Music" />
        </div>
        <button type="submit" style={styles.submitButton}>Save</button>
      </form>
    </div>
  );
}

export default ProfilePageComponent;
