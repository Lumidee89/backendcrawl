const dns = require('dns');
const axios = require('axios');

let ipData = {}; // To store detected IP information
let blockedIps = new Set(); // To store blocked IPs

// Analyze the website and store IP data
exports.analyzeWebsite = async (req, res) => {
    const { website } = req.body;

    if (!website) {
        return res.status(400).json({ message: 'Please provide a valid website URL' });
    }

    try {
        dns.lookup(website, async (err, address, family) => {
            if (err) {
                return res.status(500).json({ message: 'Error resolving website IP', error: err });
            }

            // Check if the IP is already blocked
            if (blockedIps.has(address)) {
                return res.status(403).json({ message: 'This IP is blocked' });
            }

            if (!ipData[website]) {
                ipData[website] = {
                    ipAddress: address,
                    accessCount: 0,
                    lastAccessed: new Date(),
                    logs: []
                };
            }

            ipData[website].accessCount++;
            ipData[website].lastAccessed = new Date();
            ipData[website].logs.push({
                ipAddress: address,
                timestamp: new Date()
            });

            res.json({ message: 'Website analyzed successfully', data: ipData[website] });
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while analyzing the website', error });
    }
};

// Get all IP data that has been detected
exports.getIpData = (req, res) => {
    if (Object.keys(ipData).length === 0) {
        return res.status(404).json({ message: 'No IP data available yet' });
    }

    res.json({ ipData });
};

exports.blockedIps = blockedIps;

// Block an IP address
exports.blockIp = (req, res) => {
    const { ipAddress } = req.body;

    if (!ipAddress) {
        return res.status(400).json({ message: 'Please provide a valid IP address' });
    }

    // Add the IP address to the blocked list
    blockedIps.add(ipAddress);

    res.json({ message: `IP address ${ipAddress} has been blocked successfully` });
};

// Get all blocked IP addresses
exports.getBlockedIps = (req, res) => {
    res.json({ blockedIps: Array.from(blockedIps) });
};

// Unblock an IP address
exports.unblockIp = (req, res) => {
    const { ipAddress } = req.body;

    if (!ipAddress) {
        return res.status(400).json({ message: 'Please provide a valid IP address' });
    }

    if (!blockedIps.has(ipAddress)) {
        return res.status(404).json({ message: 'IP address is not blocked' });
    }

    // Remove the IP from the blocked list
    blockedIps.delete(ipAddress);

    res.json({ message: `IP address ${ipAddress} has been unblocked` });
};
