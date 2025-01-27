const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { register, login, getProfile, hostproperty, getAllProperties, editProfile } = require('../Controllers/authController');

const router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Use upload.single('profile_picture') to handle the file upload in the register endpoint
router.post('/register', upload.single('profile_picture'), register);
router.post('/login', login);
router.post('/getProfile', getProfile);
router.post('/hostproperty', upload.array('images', 10), hostproperty);
router.get('/getAllProperties', getAllProperties);
router.post('/editProfile', upload.single('profile_picture'), editProfile);

module.exports = router;