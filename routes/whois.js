const express = require('express');
const router = express.Router();
const { lookup } = require('../controllers/whoisController');

// Route to handle WHOIS lookup using URL params
router.get('/:domain', lookup);

module.exports = router;
