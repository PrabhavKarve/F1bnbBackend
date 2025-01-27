const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/auth');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Ensure this line is present
// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI; 
//const MONGO_URI = 'mongodb+srv://PrabhavKarve:Prabhav247$$@cluster0.w58n6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your connection string
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