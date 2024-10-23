import express from 'express';
const router = express.Router();
import { analyzeDomain } from '../controllers/aiInsightsController.js';

router.get('/aiinsights/:domain', analyzeDomain);

export default router;