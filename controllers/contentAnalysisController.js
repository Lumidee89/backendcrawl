const axios = require('axios');
const { performance } = require('perf_hooks');

// Function to analyze website speed
const analyzeWebsiteSpeed = async (req, res) => {
    const { website } = req.body;

    if (!website) {
        return res.status(400).json({ message: 'Please provide a valid website URL' });
    }

    try {
        // Measure the time it takes to make a request
        const start = performance.now();

        await axios.get(website);

        const end = performance.now();
        const duration = end - start;

        // Respond with the time taken
        res.json({
            message: 'Website speed analysis completed',
            website,
            duration: `${duration.toFixed(2)} milliseconds`
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while analyzing website speed',
            error: error.message
        });
    }
};

module.exports = {
    analyzeWebsiteSpeed
};
