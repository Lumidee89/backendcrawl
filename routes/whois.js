import express from 'express';
const router = express.Router();
import { lookup } from '../controllers/whoisController.js';

router.get('/:domain', lookup);

export default router;