const express = require('express');
const router = express.Router();
const ipController = require('../controllers/ipController');

router.post('/analyze-website', ipController.analyzeWebsite);
router.get('/ip-analysis', ipController.getIpData);
router.post('/block', ipController.blockIp);
router.post('/unblock', ipController.unblockIp);
router.get('/blocked-ips', ipController.getBlockedIps);

module.exports = router;