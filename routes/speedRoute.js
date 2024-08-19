const express = require('express');
const router = express.Router();
const { analyzeWebsiteSpeed } = require('../controllers/contentAnalysisController');

router.post('/analyze', analyzeWebsiteSpeed);

module.exports = router;
