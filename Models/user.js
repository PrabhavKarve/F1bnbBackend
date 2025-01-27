const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  username: {
    type: String,
    required: true, // Optional: Set to true if you want to make it required
    unique: true, // Optional: Ensures usernames are unique
  },
  date_of_birth: {
    type: Date, // Using Date type for date_of_birth
    required: true, // Optional: Set to true if you want to make it required
  },
  city: {
    type: String,
    required: true, // Optional: Set to true if you want to make it required
  },
  state: {
    type: String,
    required: true, // Optional: Set to true if you want to make it required
  },
  profile_picture: {
    type: String, // Storing the URL or path to the profile picture
    required: false, // Optional: Set to true if you want to make it required
  },
  about: {
    type: String, // A brief description about the user
    required: false, // Optional: Set to true if you want to make it required
  },
  rating: {
    type: Number, // User rating, can be a float
    required: false, // Optional: Set to true if you want to make it required
    default: 0, // Default value if not provided
  },
  review_count: {
    type: Number, // Count of reviews given by the user
    required: false, // Optional: Set to true if you want to make it required
    default: 0, // Default value if not provided
  },
}, { timestamps: true }); // Optional: Adds createdAt and updatedAt timestamps

const User = mongoose.model('User', userSchema);
module.exports = User;
