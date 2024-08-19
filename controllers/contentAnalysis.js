const axios = require('axios');
const cheerio = require('cheerio');
const stringSimilarity = require('string-similarity');

const googleApiKey = 'AIzaSyB1nxI9X6p-SZPn0_opZlaxS12ux3myNtI';
const customSearchEngineId = '24c939fb91645401e';

async function analyzeWebsite(url, referenceContent) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const websiteContent = $('body').text();
        
        const similarityScore = stringSimilarity.compareTwoStrings(websiteContent, referenceContent);
        const impactScore = Math.min(100, websiteContent.length / 100); 

        const similarContentDetails = await getSimilarContentDetails(websiteContent, url);

        return {
            domain: url,
            similarityScore,
            impactScore,
            similarContentDetails,  
            analysisDate: new Date().toISOString() 
        };
    } catch (error) {
        console.error('Error analyzing website:', error);
        throw new Error('Content analysis failed');
    }
}

async function getSimilarContentDetails(inputContent, domain) {
    const similarContentDetails = [];
    
    try {
        const searchQuery = `related:${domain}`;
        const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${googleApiKey}&cx=${customSearchEngineId}`;
        
        const { data } = await axios.get(googleSearchUrl);
        const searchResults = data.items || [];

        for (const result of searchResults) {
            const similarUrl = result.link;

            try {
                const { data } = await axios.get(similarUrl);
                const $ = cheerio.load(data);
                const similarContent = $('body').text();

                const similarityScore = stringSimilarity.compareTwoStrings(inputContent, similarContent);

                similarContentDetails.push({
                    similarUrl,
                    similarityScore,
                    detectionDate: new Date().toISOString()
                });
            } catch (error) {
                console.error(`Error analyzing similar website ${similarUrl}:`, error);
            }
        }
    } catch (error) {
        console.error('Error performing Google Custom Search:', error);
    }

    return similarContentDetails;
}

module.exports = {
    analyzeWebsite,
};
