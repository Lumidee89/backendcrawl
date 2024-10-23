import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

const analyzeDomain = async (req, res) => {
    const { domain } = req.params;

    if (!domain) {
        return res.status(400).json({ msg: 'Domain is required' });
    }

    try {
        const sanitizedDomain = domain.replace(/[^a-zA-Z0-9-.]/g, '');
        const prompt = `Analyze the following domain: ${sanitizedDomain}. 
        Provide a detailed analysis on:
        1. Summary of insights
        2. Content quality analysis
        3. Trend analysis
        4. Violation predictions
        5. Recommendations
        6. Enhanced readability
        7. Increased originality
        8. Compliance
        `;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are an AI that analyzes websites.' },
                { role: 'user', content: prompt }
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const insights = response.data.choices[0].message.content;

        return res.status(200).json({ msg: 'AI Insights Generated', data: insights });
    } catch (error) {
        console.error('Error analyzing domain:', error.response ? error.response.data : error.message);
        return res.status(500).json({ msg: 'Error analyzing domain', error: error.message });
    }
};

export { analyzeDomain };