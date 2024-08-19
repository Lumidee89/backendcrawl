const express = require('express');
const router = express.Router();
const { analyzeWebsiteSpeed } = require('../controllers/contentAnalysisController');

<<<<<<< HEAD
// Route for analyzing website speed
=======
>>>>>>> f5a0024 (first commit)
router.post('/analyze', analyzeWebsiteSpeed);

module.exports = router;
