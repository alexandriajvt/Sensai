//Allows users to enable/disable notifications

import React, { useState, useEffect } from 'react';

const NotificationToggle = ({ userId }) => {
  const [isChecked, setIsChecked] = useState(false); // Initialize state
  const [loading, setLoading] = useState(false); // Optional loading state

  // Fetch the user's current notification preference
  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${userId}/preferences`);
        if (!response.ok) {
          throw new Error('Failed to fetch notification preference');
        }
        const data = await response.json();
        setIsChecked(data.notificationsEnabled); // Update state based on backend data
      } catch (error) {
        console.error('Error fetching preference:', error);
      }
    };

    fetchPreference();
  }, [userId]);

  // Handle checkbox toggle
  const handleToggle = async (e) => {
    const enableNotifications = e.target.checked; // Get new checkbox state
    setIsChecked(enableNotifications); // Update local state
    setLoading(true); // Show loading state (optional)

    try {
      const response = await fetch('http://localhost:5001/api/notifications/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId, // Pass user ID
          enableNotifications: enableNotifications, // True or false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      const data = await response.json();
      console.log(data.message); // Log success message
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle} // Trigger API call on toggle
        />
        Enable Notifications
      </label>
      {loading && <p>Updating...</p>} {/* Optional loading spinner */}
    </div>
  );
};

export default NotificationToggle;
