//Allows users to enable/disable notifications
import React from 'react';

const NotificationToggle = ({ value, onChange }) => {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        Enable Notifications
      </label>
    </div>
  );
};

export default NotificationToggle;
