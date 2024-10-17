const express = require('express');
const router = express.Router();
const { signup, login, editProfile } = require('../../controllers/user.controller');

// Existing routes
router.post('/signup', signup);
router.post('/login', login);

// New Edit Profile Route
router.put('/edit-profile', editProfile); 

module.exports = router;
