const axios = require("axios");
const cheerio = require("cheerio");
const stringSimilarity = require("string-similarity");

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_API_URL = process.env.SCRAPER_API_URL;

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

exports.checkViolations = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "Website URL is required" });
  }

  try {
    const websiteContent = await fetchWebsiteContent(url);
    const $ = cheerio.load(websiteContent);
    const contentText = $("body").text();

    const keywordViolations = detectKeywordViolations(contentText);

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

const fetchWebsiteContent = async (url) => {
  try {
    const response = await axios.get(SCRAPER_API_URL, {
      params: {
        api_key: SCRAPER_API_KEY,
        url: url,
        render: true, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching website content:", error);
    throw new Error("Error fetching website content");
  }
};

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
