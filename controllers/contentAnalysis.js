const axios = require('axios');
const cheerio = require('cheerio');
const stringSimilarity = require('string-similarity');


async function analyzeWebsite(url, referenceContent) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const websiteContent = $('body').text();
        const similarityScore = stringSimilarity.compareTwoStrings(websiteContent, referenceContent);
        const impactScore = Math.min(100, websiteContent.length / 100); 

        return {
            similarityScore,
            impactScore,
        };
    } catch (error) {
        console.error('Error analyzing website:', error);
        throw new Error('Content analysis failed');
    }
}

module.exports = {
    analyzeWebsite, 
};
