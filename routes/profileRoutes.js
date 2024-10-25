const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path"); // Add this to use `path`
const profileController = require("../controllers/profileController"); // Make sure this import is correct

const authMiddleware = require("../middleware/authMiddleware"); // Auth middleware

router.use(authMiddleware); // Apply auth middleware to all routes

// Update profile
router.put("/update", profileController.updateProfile);

// Delete account
router.delete("/delete", profileController.deleteAccount);

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/", // Destination folder for uploaded files
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Unique file name
  },
});

// Set upload settings with limits and multer config
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
}).single("profilePicture"); // Handle single file upload with the fieldname 'profilePicture'

// Update profile picture route
router.put(
  "/update-profile-picture",
  upload,
  profileController.updateProfilePicture
);

// Update Password
router.put("/update-password", profileController.updatePassword);

module.exports = router;
