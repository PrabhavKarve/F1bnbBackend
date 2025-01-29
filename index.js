const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/auth');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
      origin: "https://f1bnb-frontend.vercel.app", // Replace with your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // If using cookies/sessions
  })
);
app.options('*', cors()); 
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