const express = require('express');
const router = express.Router();
const { lookup } = require('../controllers/whoisController');

<<<<<<< HEAD
// Route to handle WHOIS lookup using URL params
=======
>>>>>>> f5a0024 (first commit)
router.get('/:domain', lookup);

module.exports = router;
