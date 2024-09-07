const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Update Profile
exports.updateProfile = async (req, res) => {
  const { fullName, about, email, phoneNumber } = req.body;

  console.log(req.user);

  if (!req.userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update the user profile fields
    user.fullName = fullName || user.fullName;
    user.about = about || user.about;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    res.status(200).json({ msg: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Profile Picture
exports.updateProfilePicture = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Assuming the file is uploaded and its path is in req.file
    if (req.file) {
      user.profilePicture = req.file.path;
    }

    await user.save();

    res.status(200).json({ msg: "Profile picture updated successfully", user });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
