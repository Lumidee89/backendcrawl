import express from 'express';
const router = express.Router();
import { analyzeWebsiteSpeed } from '../controllers/contentAnalysisController.js';

router.post('/analyze', analyzeWebsiteSpeed);

export default router;