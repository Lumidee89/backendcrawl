const { blockedIps } = require('../controllers/ipController');

// Middleware to check if the incoming request's IP is blocked
const checkBlockedIp = (req, res, next) => {
    const ip = req.ip;

    // Ensure blockedIps is defined and contains the IP
    if (blockedIps && blockedIps.has(ip)) {
        return res.status(403).json({ message: 'Access forbidden: Your IP is blocked' });
    }

    next();
};

module.exports = checkBlockedIp;
