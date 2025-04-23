//Allows students to set up interests, dorms, and notifications
import React, { useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    schoolId: '',
    email: '',
    major: '',
    classification: '',
    expectedGraduation: '',
    dorm: '',
    organizations: [],
    interests: [],
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      notificationPreferences: {
        ...prevState.notificationPreferences,
        [name]: checked
      }
    }));
  };

  const handleOrganizationChange = (e) => {
    const orgs = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prevState => ({
      ...prevState,
      organizations: orgs
    }));
  };

  const handleInterestChange = (e) => {
    const interests = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prevState => ({
      ...prevState,
      interests: interests
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.schoolId.trim()) {
      newErrors.schoolId = 'School ID is required';
    } else if (!/^[Jj]\d{8}$/.test(formData.schoolId)) {
      newErrors.schoolId = 'Invalid JSU ID format (e.g., J12345678)';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.major.trim()) {
      newErrors.major = 'Major is required';
    }
    if (!formData.classification) {
      newErrors.classification = 'Classification is required';
    }
    if (!formData.expectedGraduation) {
      newErrors.expectedGraduation = 'Expected graduation date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Form submitted:', formData);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to update profile. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>JSU Student Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="schoolId">JSU ID</label>
            <input
              type="text"
              id="schoolId"
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              placeholder="J12345678"
              className={errors.schoolId ? 'error' : ''}
            />
            {errors.schoolId && <span className="error-message">{errors.schoolId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">JSU Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="username@jsums.edu"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </section>

        <section className="form-section">
          <h2>Academic Information</h2>
          <div className="form-group">
            <label htmlFor="major">Major</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              className={errors.major ? 'error' : ''}
            />
            {errors.major && <span className="error-message">{errors.major}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="classification">Classification</label>
            <select
              id="classification"
              name="classification"
              value={formData.classification}
              onChange={handleChange}
              className={errors.classification ? 'error' : ''}
            >
              <option value="">Select Classification</option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="graduate">Graduate</option>
            </select>
            {errors.classification && <span className="error-message">{errors.classification}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="expectedGraduation">Expected Graduation</label>
            <input
              type="month"
              id="expectedGraduation"
              name="expectedGraduation"
              value={formData.expectedGraduation}
              onChange={handleChange}
              className={errors.expectedGraduation ? 'error' : ''}
            />
            {errors.expectedGraduation && <span className="error-message">{errors.expectedGraduation}</span>}
          </div>
        </section>

        <section className="form-section">
          <h2>Housing Information</h2>
          <div className="form-group">
            <label htmlFor="dorm">Residence Hall</label>
            <select
              id="dorm"
              name="dorm"
              value={formData.dorm}
              onChange={handleChange}
            >
              <option value="">Select Residence Hall</option>
              <option value="campbell">Campbell Hall</option>
              <option value="dixon">Dixon Hall</option>
              <option value="hudson">Hudson Hall</option>
              <option value="off-campus">Off Campus</option>
            </select>
          </div>
        </section>

        <section className="form-section">
          <h2>Organizations & Interests</h2>
          <div className="form-group">
            <label htmlFor="organizations">Organizations of Interest</label>
            <select
              multiple
              id="organizations"
              name="organizations"
              value={formData.organizations}
              onChange={handleOrganizationChange}
              className="organizations-select"
            >
              <option value="academic">Academic Clubs</option>
              <option value="sports">Sports Teams</option>
              <option value="cultural">Cultural Organizations</option>
              <option value="greek">Greek Life</option>
              <option value="service">Service Organizations</option>
              <option value="religious">Religious Groups</option>
              <option value="political">Political Groups</option>
              <option value="professional">Professional Organizations</option>
            </select>
            <small className="help-text">Hold Ctrl/Cmd to select multiple organizations</small>
          </div>

          <div className="form-group">
            <label htmlFor="interests">Areas of Interest</label>
            <select
              multiple
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleInterestChange}
              className="organizations-select"
            >
              <option value="academic">Academic Events</option>
              <option value="sports">Sports Events</option>
              <option value="cultural">Cultural Events</option>
              <option value="social">Social Events</option>
              <option value="career">Career Development</option>
              <option value="community">Community Service</option>
              <option value="entertainment">Entertainment</option>
            </select>
            <small className="help-text">Hold Ctrl/Cmd to select multiple interests</small>
          </div>
        </section>

        <section className="form-section">
          <h2>Notification Preferences</h2>
          <div className="notification-preferences">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email"
                checked={formData.notificationPreferences.email}
                onChange={handleNotificationChange}
              />
              Email Notifications
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="push"
                checked={formData.notificationPreferences.push}
                onChange={handleNotificationChange}
              />
              Push Notifications
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="sms"
                checked={formData.notificationPreferences.sms}
                onChange={handleNotificationChange}
              />
              SMS Notifications
            </label>
          </div>
        </section>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;