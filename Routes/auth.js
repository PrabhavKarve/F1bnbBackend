const express = require('express');
const multer = require('multer');
require('dotenv').config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { register, login, getProfile, hostProperty, getAllProperties, editProfile } = require('../Controllers/authController');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Set up Multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder
    resource_type: "image",
    format: 'jpg'
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

// Use upload.single('profile_picture') to handle the file upload in the register endpoint
router.post('/register', upload.single('profile_picture'), register);
router.post('/login', login);
router.post('/getProfile', getProfile);
//router.post('/hostProperty', upload.array('images', 10), hostProperty);
router.post('/hostProperty', hostProperty);
router.get('/getAllProperties', getAllProperties);
router.post('/editProfile', upload.single('profile_picture'), editProfile);

module.exports = router;