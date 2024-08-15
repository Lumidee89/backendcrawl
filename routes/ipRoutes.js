const express = require('express');
const router = express.Router();
const { analyzeWebsite, getIpData } = require('../controllers/ipController');

// Route to input a website for analysis
router.post('/analyze-website', analyzeWebsite);

// Route to get monitored IP addresses
router.get('/ip-analysis', getIpData);

module.exports = router;
