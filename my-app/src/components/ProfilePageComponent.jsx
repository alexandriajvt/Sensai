//ProfilePageComponent.jsx
import React, { useState, useEffect } from 'react';
import NotificationToggle from './NotificationToggle';
import { useNavigate } from 'react-router-dom';


function ProfilePageComponent({userData, userId}) {
  const [availableInterests, setAvailableInterests] = useState([]);
  const navigate = useNavigate();//used for rerouting after savign profile
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/categories/interests');
        if (!response.ok) throw new Error('Failed to fetch interests');
        const data = await response.json();
        setAvailableInterests(data); // ✅ Store all interests from API
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, []);

  //fetch the user's saved interests from user_interests
  useEffect(() => {
    const fetchUserInterests = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`http://localhost:5001/api/users/${userId}/interests`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch user interests');

            const data = await response.json();
            console.log('Fetched user interests:', data.interestIds); // ✅ Debugging log

            // ✅ Prepopulate checkboxes
            const interestsMap = data.interestIds.reduce((acc, interestId) => {
                acc[interestId] = true;
                return acc;
            }, {});

            setSelectedInterests(interestsMap);
        } catch (error) {
            console.error('Error fetching user interests:', error);
        }
    };

    if (userId) {
        fetchUserInterests();
    }
}, [userId]);


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
          email: !!userData.notifications_enabled, // ✅ Ensure boolean conversion
      },
      });
      console.log('Mapped interests:', userData.interests);
      
      const interestsMap = (userData.interests || []).reduce((acc, interestId) => {
        acc[interestId] = true;
        return acc;
      }, {});
    
      setSelectedInterests(interestsMap);
    }
  }, [userData]);


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
      email:userData?.notifications_enabled === 1,},
  });


  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState({});

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

  const handleInterestChange = (interestId) => {
    setSelectedInterests(prev => {
      const updatedInterests = { ...prev, [interestId]: !prev[interestId] };
      return updatedInterests;
    });
  };


  const validateForm = () => {
    console.log('Validating form...'); // ✅ Debugging log
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
    console.log('Validation errors:', newErrors); // ✅ Debugging log
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        setIsSubmitting(true);
        const token = localStorage.getItem('authToken');

        try {
            // Extract selected interest IDs
            const selectedInterestIds = Object.entries(selectedInterests)
                .filter(([_, isSelected]) => isSelected)
                .map(([id]) => id);
            


            // ✅ Send user profile update request
            const userResponse = await fetch(`http://localhost:5001/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...formData,
                  notifications_enabled: formData.notificationPreferences.email ? 1 : 0, // ✅ Ensure correct format
              }),
            });

            if (!userResponse.ok) {
                throw new Error('Failed to update user profile');
            }



            console.log('User profile updated successfully.');

            // Sends interests update request separately since its a different table and interests are not stored in user table
            const interestsResponse = await fetch(`http://localhost:5001/api/users/${userId}/setInterests`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ interestIds: selectedInterestIds }), // 🔹 Send only interests
            });
            if (!interestsResponse.ok) {
                throw new Error('Failed to update interests');
            }

            console.log('Interests updated successfully.');
            alert('Profile update request sent successfully! One moment for the update to complete.');
            
            const notificationToggleResponse = await fetch('http://localhost:5001/api/notifications/alert/preferences', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, enableNotifications: formData.notificationPreferences.email }),
          });
          
          if (!notificationToggleResponse.ok) {
              throw new Error('Failed to update notification preferences');
          }
          console.log('Notification preferences updated successfully.');
          
          // ✅ Call `sendEventNotification` to send event notifications
          const eventNotificationResponse = await fetch('http://localhost:5001/api/notifications/alert', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });
          
          if (!eventNotificationResponse.ok) {
              throw new Error('Failed to send event notifications');
          }
          console.log('Event notifications sent successfully.');
        
          navigate('/calendar'); 


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
            {availableInterests.map((interest) => (
              <label key={interest.id} className="interest-checkbox">
                <input
                  type="checkbox"
                  id={`interest-${interest.id}`}
                  checked={selectedInterests[interest.id] || false}
                  onChange={(e) => handleInterestChange(interest.id, e.target.checked)}
                />
                <span>{interest.name}</span> {/* Dynamically loads interest names */}
              </label>
            ))}
          </div>
        </section>
        
        <section className="form-section">
          <h3>Notification Preferences</h3>
  <         div className="notification-preferences">
              <NotificationToggle
              value={formData.notificationPreferences.email}
              onChange={(checked) => setFormData(prev => ({
                ...prev,
                notificationPreferences: { ...prev.notificationPreferences, email: checked }
              }))}
            />
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