const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/auth');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
// CORS Configuration
const corsOptions = {
  origin: "https://aig-frontend-one.vercel.app", // Your frontend domain
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
  credentials: true, // Include cookies or authorization headers if needed
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests
app.options("*", cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Ensure this line is present
// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI; 
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to My Express App!');
});