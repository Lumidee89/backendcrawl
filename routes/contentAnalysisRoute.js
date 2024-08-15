const express = require('express');
const router = express.Router();
const contentAnalysisService = require('../controllers/contentAnalysis');
const { analyzeWebsiteSpeed } = require('../controllers/contentAnalysisController');


router.post('/analyze', async (req, res) => {
    const { url, referenceContent } = req.body;

    if (!url || !referenceContent) {
        return res.status(400).json({ error: 'URL and reference content are required.' });
    }

    try {
        const analysisResult = await contentAnalysisService.analyzeWebsite(url, referenceContent);
        res.status(200).json(analysisResult);
    } catch (error) {
        console.error('Error analyzing website:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
