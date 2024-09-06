const express = require('express');
const router = express.Router();
const { analyzeWebsite } = require('../controllers/contentAnalysis');

router.get('/analyze', async (req, res) => {
    const { url, referenceContent } = req.body;
    
    if (!url || !referenceContent) {
        return res.status(400).json({ msg: 'URL and reference content are required' });
    }

    try {
        const result = await analyzeWebsite(url, referenceContent);
        res.json(result);
    } catch (error) {
        res.status(500).json({ msg: 'Error analyzing website', error });
    }
});

module.exports = router;
