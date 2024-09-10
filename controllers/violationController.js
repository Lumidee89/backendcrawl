const axios = require("axios");
const cheerio = require("cheerio");
const stringSimilarity = require("string-similarity");

// Replace with your Scraper API key
const SCRAPER_API_KEY = "934259ada971480167484c089f42b5ba";
const SCRAPER_API_URL = "http://api.scraperapi.com";

// Predefined policy violations and keywords
const policyViolations = [
  "spam",
  "malware",
  "phishing",
  "pornographic content",
  "abusive language",
];

const violationKeywords = {
  spam: ["buy now", "click here", "free money"],
  malware: ["download trojan", "install virus"],
  phishing: ["enter your credit card", "password reset"],
  pornographic: ["explicit content", "adult videos"],
  abusive: ["hate speech", "offensive language"],
};

// Analyze website for policy violations using predefined keywords
exports.checkViolations = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "Website URL is required" });
  }

  try {
    // Fetch website content
    const websiteContent = await fetchWebsiteContent(url);
    const $ = cheerio.load(websiteContent);
    const contentText = $("body").text();

    // Detect predefined violation keywords
    const keywordViolations = detectKeywordViolations(contentText);

    // Respond with detected violations
    if (keywordViolations.length > 0) {
      res.status(200).json({
        domain: url,
        violations: keywordViolations,
        message: `Policy violations found: ${keywordViolations.length} issues detected.`,
      });
    } else {
      res.status(200).json({
        domain: url,
        message: "No policy violations detected.",
      });
    }
  } catch (error) {
    console.error("Error analyzing website:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch website content using Scraper API
const fetchWebsiteContent = async (url) => {
  try {
    const response = await axios.get(SCRAPER_API_URL, {
      params: {
        api_key: SCRAPER_API_KEY,
        url: url,
        render: true, // To ensure dynamic content is loaded
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching website content:", error);
    throw new Error("Error fetching website content");
  }
};

// Detect predefined violations based on keywords
const detectKeywordViolations = (content) => {
  const detectedViolations = [];

  Object.keys(violationKeywords).forEach((violation) => {
    const keywords = violationKeywords[violation];
    keywords.forEach((keyword) => {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        detectedViolations.push({
          violationType: violation,
          matchedKeyword: keyword,
          description: `Content related to ${violation} was detected.`,
        });
      }
    });
  });

  return detectedViolations;
};
