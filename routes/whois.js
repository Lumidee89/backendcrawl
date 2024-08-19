const express = require('express');
const router = express.Router();
const { lookup } = require('../controllers/whoisController');

router.get('/:domain', lookup);

module.exports = router;
