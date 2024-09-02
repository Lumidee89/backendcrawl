const User = require('../models/User');

// Update Profile
exports.updateProfile = async (req, res) => {
    const { fullName, about, email, phoneNumber } = req.body;

    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update the user profile fields
        user.fullName = fullName || user.fullName;
        user.about = about || user.about;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;

        await user.save();

        res.status(200).json({ msg: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    try {
        const user = await User.findByIdAndDelete(req.user._id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};
