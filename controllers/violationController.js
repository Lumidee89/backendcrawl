const axios = require('axios');

const mockViolationService = (url) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                violations: [
                    { url: `${url}/spam-content`, reason: 'Spam content detected' },
                    { url: `${url}/malware`, reason: 'Malware suspected' },
                    { url: `${url}/phishing`, reason: 'Phishing attempt detected' },
                    { url: `${url}/pornographic`, reason: 'Pornographic content detected' },
                    { url: `${url}/abusive-language`, reason: 'Abusive language detected' }
                ]
            });
        }, 1000);
    });
};

exports.checkContentViolations = async (req, res) => {
    const { website } = req.body;

    if (!website) {
        return res.status(400).json({ message: 'Please provide a valid website URL' });
    }

    try {
        const violationData = await mockViolationService(website);

        res.json({ message: 'Content violation check completed', data: violationData });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while checking content violations', error });
    }
};
