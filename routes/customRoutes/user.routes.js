const express = require('express');
const router = express.Router();
const { signup, login, editProfile, getUser } = require('../../controllers/user.controller');

// Existing routes
router.post('/signup', signup);
router.post('/login', login);

// New Edit Profile Route
router.put('/edit-profile', editProfile); 

// Get User Detail Route
router.post('/get-user', getUser); 

module.exports = router;
