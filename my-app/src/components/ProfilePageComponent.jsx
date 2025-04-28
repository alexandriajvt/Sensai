//ProfilePageComponent.jsx
import React, { useState, useEffect } from 'react';
//import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; // Ensure authentication integration
import NotificationToggle from './NotificationToggle';

// Available interests categories
const INTERESTS_CATEGORIES = {
  academic: [
    { id: 'research', label: 'Research Opportunities' },
    { id: 'workshops', label: 'Academic Workshops' },
    { id: 'tutoring', label: 'Tutoring Services' },
    { id: 'study_groups', label: 'Study Groups' },
    { id: 'honors', label: 'Honors Programs' }
  ],
  sports: [
    { id: 'football', label: 'Football Games' },
    { id: 'basketball', label: 'Basketball Games' },
    { id: 'baseball', label: 'Baseball Games' },
    { id: 'track', label: 'Track & Field' },
    { id: 'intramural', label: 'Intramural Sports' }
  ],
  cultural: [
    { id: 'art_exhibits', label: 'Art Exhibits' },
    { id: 'music_events', label: 'Music Events' },
    { id: 'dance', label: 'Dance Performances' },
    { id: 'theater', label: 'Theater Productions' },
    { id: 'cultural_festivals', label: 'Cultural Festivals' }
  ],
  career: [
    { id: 'job_fairs', label: 'Job Fairs' },
    { id: 'internships', label: 'Internship Opportunities' },
    { id: 'resume_workshops', label: 'Resume Workshops' },
    { id: 'networking', label: 'Networking Events' },
    { id: 'career_counseling', label: 'Career Counseling' }
  ],
  social: [
    { id: 'student_orgs', label: 'Student Organization Events' },
    { id: 'greek_life', label: 'Greek Life Events' },
    { id: 'campus_parties', label: 'Campus Parties' },
    { id: 'movie_nights', label: 'Movie Nights' },
    { id: 'game_nights', label: 'Game Nights' }
  ]
};

function ProfilePageComponent({userData, userId}) {
  // Update formData whenever userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        schoolId: userData.student_id || '',
        email: userData.email || '',
        major: userData.major || '',
        classification: userData.classification || '',
        dorm: userData.residence || '',
        interests: userData.interests || [],
        notificationPreferences: {
          email: userData.notifications_enabled === 1, // Convert DB integer to boolean
        },
      });

      const interestsMap = (userData.interests || []).reduce((acc, interestId) => {
        acc[interestId] = true;
        return acc;
      }, {});
      setSelectedInterests(interestsMap);
    }
  }, [userData]);

  console.log('Received userData:', userData); // Debug userId prop
  const [formData, setFormData] = useState({
    name: '',
    schoolId: '',
    email: '',
    major: '',
    classification: '',
    dorm: '',
    organizations: [],
    interests: [],
    notificationPreferences: {
      email: userData?.notifications_enabled === 1,
    },
  });


  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState(() => {
    
  
    const interestsMap = formData.interests.reduce((acc, interestId) => {
      acc[interestId] = true;
      return acc;
    }, {});
    return interestsMap;
  });
  

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

  // const handleNotificationChange = (e) => {
  //   const { name, checked } = e.target;
  //   setFormData(prevState => ({
  //     ...prevState,
  //     notificationPreferences: {
  //       ...prevState.notificationPreferences,
  //       [name]: checked
  //     }
  //   }));
  // };

  const handleInterestChange = (category, interestId) => {
    setSelectedInterests(prev => ({
      ...prev,
      [interestId]: !prev[interestId]
    }));
  };

  const handleCategorySelect = (category) => {
    const categoryInterests = INTERESTS_CATEGORIES[category];
    const allSelected = categoryInterests.every(interest => selectedInterests[interest.id]);
    
    const newSelectedInterests = { ...selectedInterests };
    categoryInterests.forEach(interest => {
      newSelectedInterests[interest.id] = !allSelected;
    });
    
    setSelectedInterests(newSelectedInterests);
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
        const selectedInterestIds = Object.entries(selectedInterests)
          .filter(([_, isSelected]) => isSelected)
          .map(([id]) => id);

        const formDataWithInterests = {
          ...formData,
          interests: selectedInterestIds,
        };

        // Send updated profile to the backend
        const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formDataWithInterests),
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

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
      <h2>JSU Student Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <section className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>JSU ID</label>
            <input
              type="text"
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              placeholder={formData.schoolId}
              className={errors.schoolId ? 'error' : ''}
              required
            />
            {errors.schoolId && <span className="error-message">{errors.schoolId}</span>}
          </div>

          <div className="form-group">
            <label>JSU Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="username@jsums.edu"
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </section>

        <section className="form-section">
          <h3>Academic Information</h3>
          <div className="form-group">
            <label>Major</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              className={errors.major ? 'error' : ''}
              required
            />
            {errors.major && <span className="error-message">{errors.major}</span>}
          </div>

          <div className="form-group">
            <label>Classification</label>
            <select
              name="classification"
              value={formData.classification}
              onChange={handleChange}
              className={errors.classification ? 'error' : ''}
              required
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

        </section>

        <section className="form-section">
          <h3>Housing Information</h3>
          <div className="form-group">
            <label>Residence Hall</label>
            <select
              name="dorm"
              value={formData.dorm}
              onChange={handleChange}
            >
              <option value="">Select Residence Hall</option>
              <option value="Alexander Hall">Alexander Hall</option>
              <option value="Transitional Hall">Transitional Hall</option>
              <option value="Campbell College North">Campbell College North</option>
              <option value="Campbell College South">Campbell College South</option>
              <option value="Dixon">Dixon Hall</option>
              <option value="Hudson">Hudson Hall</option>
              <option value="Stewart">Stewart Hall</option>
              <option value="One University">One University</option>
              <option value="Commuter">Commuter</option>
            </select>
          </div>
        </section>

        <section className="form-section">
          <h3>Interests & Events</h3>
          <div className="interests-container">
            {Object.entries(INTERESTS_CATEGORIES).map(([category, interests]) => (
              <div key={category} className="interest-category">
                <div className="category-header">
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)} Events</h4>
                  <button
                    type="button"
                    className="select-all-button"
                    onClick={() => handleCategorySelect(category)}
                  >
                    Select All
                  </button>
                </div>
                <div className="interests-grid">
                  {interests.map(interest => (
                    <label key={interest.id} className="interest-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedInterests[interest.id] || false}
                        onChange={() => handleInterestChange(category, interest.id)}
                      />
                      <span>{interest.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="form-section">
          <h3>Notification Preferences</h3>
  <         div className="notification-preferences">
            <NotificationToggle userId={userId} />
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
export default ProfilePageComponent;