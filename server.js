require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const contactsRouter = require('./routes/contacts');
app.use('/api/contacts', contactsRouter);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Contacts API is running!',
    endpoints: {
      'GET /api/contacts': 'Get all contacts',
      'GET /api/contacts/:id': 'Get contact by ID',
      'POST /api/contacts': 'Create new contact',
      'PUT /api/contacts/:id': 'Update contact by ID',
      'DELETE /api/contacts/:id': 'Delete contact by ID'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api/contacts`);
});