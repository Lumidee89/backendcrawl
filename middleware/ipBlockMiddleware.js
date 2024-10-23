import { blockedIps } from '../controllers/ipController.js';

const checkBlockedIp = (req, res, next) => {
    const ip = req.ip;

    if (blockedIps && blockedIps.has(ip)) {
        return res.status(403).json({ message: 'Access forbidden: Your IP is blocked' });
    }

    next();
};

export default checkBlockedIp;