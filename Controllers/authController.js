const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Property = require('../Models/properties');
const SECRET_KEY = 'your_secret_key'; // Replace with an env variable in production

// Register a new user
const register = async (req, res) => {
  const { email, password, username, date_of_birth, city, state } = req.body;
  const profile_picture = req.file ? req.file.path : null; // Get the uploaded image path

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user with all fields
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      date_of_birth,
      city,
      state,
      profile_picture, // This will be the path to the uploaded image
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '1h' });
    
    // Respond with success message and token
    res.status(201).json({ message: 'User registered successfully.', token });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully.', token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { email } = req.body; // Assuming email is passed as a route parameter

    // Find the user by email
    const user = await User.findOne({ email });
    const properties = await Property.find({ username: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's profile
    res.status(200).json({
      email: user.email,
      username: user.username,
      date_of_birth: user.date_of_birth,
      city: user.city,
      state: user.state,
      rating: user.rating,
      review_count: user.review_count,
      about: user.about,
      profile_picture: user.profile_picture,
      properties: properties
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const hostProperty = async (req, res) => {
  try {
    const {
      email,
      property_name,
      no_of_guests,
      no_of_bedrooms,
      no_of_bed,
      no_of_bath,
      about,
      amenities,
      price_per_night,
      type,
      images,
      city,
      state
    } = req.body;
    // Optional: Add additional validation or checks here
    if (!property_name || !email) {
      return res.status(400).json({ message: 'Property name and email are required' });
    }

    // Create the new property object
    const newProperty = new Property({
      property_name,
      username: email, // Assuming email is the username
      no_of_guests,
      no_of_bedrooms,
      no_of_bed,
      no_of_bath,
      about,
      amenities,
      price_per_night,
      type,
      images,// Include the images array,
      city,
      state
    });
    // Save the property to the database
    await newProperty.save();

    // Respond with the saved property
    res.status(201).json({ message: 'Property successfully listed', property: newProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllProperties = async (req, res) => {
  try {
    // Fetch all properties from the database
    const properties = await Property.find();
    // Respond with the properties
    res.status(200).json({ message: 'Properties fetched successfully.', properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const { oldemail } = req.body;
    if (!oldemail) {
        return res.status(400).json({ message: "Old email is required to find the user" });
    }

    // Prepare the updates object by filtering out empty fields
    const updates = {};
    for (const [key, value] of Object.entries(req.body)) {
        if (value !== "" && value !== null && key !== "oldemail") {
          updates[key] = value;
        }
    }

    // Check if a profile picture is included
    if (req.file) {
        updates.profile_picture = req.file.path; // Store file path (if using multer)
    }
    // Find and update the user record in the database
    const updatedUser = await User.findOneAndUpdate(
      { email: oldemail }, // Find the user by the old email
      { $set: updates },   // Update only the provided fields
      { new: true }        // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "An error occurred while updating the profile" });
  }
}

module.exports = { register, login, getProfile, hostProperty, getAllProperties, editProfile };
