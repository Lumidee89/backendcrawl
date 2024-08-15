const express = require('express');
const router = express.Router();
const { checkContentViolations } = require('../controllers/violationController');

router.post('/check-violations', checkContentViolations);

module.exports = router;
