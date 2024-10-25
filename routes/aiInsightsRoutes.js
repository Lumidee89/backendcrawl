const express = require('express');
const router = express.Router();
const aiInsightsController = require('../controllers/aiInsightsController');

router.get('/aiinsights/:domain', aiInsightsController.analyzeDomain);

module.exports = router;