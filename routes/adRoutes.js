import express from 'express';
const router = express.Router();
import { analyzeAds } from '../controllers/adController.js';

router.get('/analyze-ads/:domain', analyzeAds);

export default router;