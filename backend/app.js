const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

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

console.log('Sensei backend is running!')
// Import your routes


const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

//Login route
const loginRoutes = require('./routes/login.routes');
app.use('/api/auth', loginRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const eventRoutes = require('./routes/events.routes');
app.use('/api/events', eventRoutes);

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
