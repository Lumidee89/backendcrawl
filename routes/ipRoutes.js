import express from 'express';
const router = express.Router();
import { 
  analyzeWebsite,
  getIpData,
  blockIp,
  unblockIp,
  getBlockedIps
} from '../controllers/ipController.js';

router.post('/analyze-website', analyzeWebsite);
router.get('/ip-analysis', getIpData);
router.post('/block', blockIp);
router.post('/unblock', unblockIp);
router.get('/blocked-ips', getBlockedIps);

export default router;