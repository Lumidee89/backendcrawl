const express = require('express');
const router = express.Router();
const ipController = require('../controllers/ipController');

// Route to input a website for analysis
router.post('/analyze-website', ipController.analyzeWebsite);

// Route to get monitored IP addresses
router.get('/ip-analysis', ipController.getIpData);

// Route to block an IP address
router.post('/block', ipController.blockIp);

// Route to unblock an IP address
router.post('/unblock', ipController.unblockIp);

// Route to get all blocked IP addresses
router.get('/blocked-ips', ipController.getBlockedIps);

module.exports = router;