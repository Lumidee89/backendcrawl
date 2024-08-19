const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.get('/analyze-ads/:domain', adController.analyzeAds);

module.exports = router;
