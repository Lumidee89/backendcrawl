const axios = require('axios');
const cheerio = require('cheerio');
const openai = require('openai'); // Use the OpenAI API
const stringSimilarity = require('string-similarity');

// Setup OpenAI API Key
openai.apiKey = process.env.OPENAI_API_KEY;

const policyViolations = [
    'spam',
    'malware',
    'phishing',
    'pornographic content',
    'abusive language'
];

const violationKeywords = {
    spam: ['buy now', 'click here', 'free money'],
    malware: ['download trojan', 'install virus'],
    phishing: ['enter your credit card', 'password reset'],
    pornographic: ['explicit content', 'adult videos'],
    abusive: ['hate speech', 'offensive language']
};

// Analyze website for policy violations using AI and predefined keywords
exports.checkViolations = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'Website URL is required' });
    }

    try {
        // Fetch website content
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const websiteContent = $('body').text();

        // Detect predefined violation keywords
        const keywordViolations = detectKeywordViolations(websiteContent);

        // Analyze content using OpenAI (AI-powered insight on pornographic content and abusive language)
        const aiViolations = await analyzeWithAI(websiteContent);

        // Combine both predefined and AI analysis results
        const violations = [...keywordViolations, ...aiViolations];

        if (violations.length > 0) {
            res.status(200).json({
                domain: url,
                violations,
                message: `Policy violations found: ${violations.length} issues detected.`,
            });
        } else {
            res.status(200).json({
                domain: url,
                message: 'No policy violations detected.',
            });
        }

    } catch (error) {
        console.error('Error analyzing website:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Detect predefined violations based on keywords
const detectKeywordViolations = (content) => {
    const detectedViolations = [];
 
    Object.keys(violationKeywords).forEach((violation) => {
        const keywords = violationKeywords[violation];
        const match = stringSimilarity.findBestMatch(content, keywords);
        if (match.bestMatch.rating > 0.2) {
            detectedViolations.push({
                violationType: violation,
                matchedKeyword: match.bestMatch.target,
                description: `Content related to ${violation} was detected.`,
            });
        }
    });

    return detectedViolations;
};

// AI-based analysis using OpenAI for more complex violations
const analyzeWithAI = async (content) => {
    try {
        const aiResponse = await openai.Completion.create({
            model: 'gpt-4',
            prompt: `Analyze the following content for violations such as pornographic material or abusive language: \n\n"${content}"`,
            max_tokens: 150,
        });

        const aiAnalysis = aiResponse.choices[0].text.trim();
        const detectedViolations = [];

        // Simple checks for AI-generated insights
        if (aiAnalysis.toLowerCase().includes('pornographic')) {
            detectedViolations.push({
                violationType: 'pornographic content',
                description: 'AI detected possible pornographic content.'
            });
        }

        if (aiAnalysis.toLowerCase().includes('abusive')) {
            detectedViolations.push({
                violationType: 'abusive language',
                description: 'AI detected possible abusive language.'
            });
        }

        return detectedViolations;
    } catch (error) {
        console.error('Error during AI analysis:', error);
        return [];
    }
};
