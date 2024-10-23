import express from 'express';
const router = express.Router();
import { checkViolations } from '../controllers/violationController.js';

router.post('/check-violations', checkViolations);

export default router;