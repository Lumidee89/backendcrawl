const express = require('express');
const router = express.Router();
const { lookup } = require('../controllers/whoisController');
const DomainDetails = require('../models/domainDetails');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:domain', lookup);
router.get('/domain-details', authMiddleware, async (req, res) => {
    try {
        const domainDetails = await DomainDetails.find({ user: req.user._id }).populate('user', '-password');
        res.status(200).json(domainDetails);
    } catch (error) {
        console.error('Error fetching domain details:', error);
        res.status(500).json({ msg: 'Error fetching domain details' });
    }
});

module.exports = router;