const dns = require('dns');
const axios = require('axios');

let ipData = {};

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

exports.getIpData = (req, res) => {
    if (Object.keys(ipData).length === 0) {
        return res.status(404).json({ message: 'No IP data available yet' });
    }

    res.json({ ipData });
};
