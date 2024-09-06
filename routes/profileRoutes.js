const express = require('express');
const router = express.Router();
const { updateProfile, profileController, deleteAccount } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); 
const multer = require('multer');

router.use(authMiddleware);

router.put('/update', updateProfile);

router.delete('/delete', deleteAccount);

module.exports = router;

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, 
}).single('profilePicture');

router.put('/update-profile-picture', upload, profileController);
