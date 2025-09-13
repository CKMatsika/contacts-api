// =======================================================
// 1. IMPORTS & INITIALIZATION
// =======================================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { specs, swaggerUi } = require('./swagger');

const app = express();

// =======================================================
// 2. CORE MIDDLEWARE
// =======================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================================================
// 3. ROUTES (CRITICAL ORDERING)
// The Swagger route MUST come before your 404 handler
// =======================================================

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
const contactsRouter = require('./routes/contacts');
app.use('/api/contacts', contactsRouter);

// =======================================================
// 4. ERROR HANDLING (MUST BE AT THE VERY END)
// =======================================================

// Handle 404 Not Found responses
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// =======================================================
// 5. DATABASE CONNECTION & SERVER START
// =======================================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  });
};

connectDB().then(() => {
  startServer();
});