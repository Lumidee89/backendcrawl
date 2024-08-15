const express = require('express');
const router = express.Router();
const { analyzeWebsiteSpeed } = require('../controllers/contentAnalysisController');

// Route for analyzing website speed
router.post('/analyze', analyzeWebsiteSpeed);

module.exports = router;
