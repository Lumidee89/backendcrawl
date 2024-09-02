const express = require('express');
const router = express.Router();
const { updateProfile, deleteAccount } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to authenticate users

// Middleware to protect routes
router.use(authMiddleware);

// Route to update profile settings
router.put('/update', updateProfile);

// Route to delete account
router.delete('/delete', deleteAccount);

module.exports = router;
