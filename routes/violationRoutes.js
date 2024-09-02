const express = require('express');
const router = express.Router();
const { checkViolations } = require('../controllers/violationController');

router.post('/check-violations', checkViolations);

module.exports = router;
