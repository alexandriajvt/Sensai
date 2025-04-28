//app.js
const express = require('express'); // Express framework
const dotenv = require('dotenv');  // Environment variable management
const cors = require('cors');      // Cross-Origin Resource Sharing middleware



// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing JSON payloads

// Example base route
app.get('/', (req, res) => {
  res.send('Sensei backend is running!');
});


// Import  routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

//Login route
const loginRoutes = require('./routes/login.routes');
app.use('/api/auth', loginRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const eventRoutes = require('./routes/events.routes');
app.use('/api/events', eventRoutes);


const categoriesRoutes = require('./routes/categories.routes');
app.use('/api/categories', categoriesRoutes);


const rsvpRoutes = require('./routes/rsvp.routes');
app.use('/api/rsvp', rsvpRoutes);

const contactRoutes = require('./routes/contact.routes');
app.use('/api/contact', contactRoutes); // mounts the contact routes at /api/contact

const notificationRoutes = require('./routes/notification.routes');
app.use('/api/notifications', notificationRoutes);


// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
