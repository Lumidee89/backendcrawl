const axios = require("axios");
const cheerio = require("cheerio");
const stringSimilarity = require("string-similarity");
const { google } = require("googleapis");
const customsearch = google.customsearch("v1");

// Replace with your Scraper API key
const SCRAPER_API_KEY = "934259ada971480167484c089f42b5ba";
const SCRAPER_API_URL = "http://api.scraperapi.com";

const GOOGLE_API_KEY = "AIzaSyCTjYQIUUyTDgty7bDdOn0ZQunf-ItIDWs";
const GOOGLE_SEARCH_ENGINE_ID = "24c939fb91645401e";

async function fetchSimilarContentFromGoogle(query) {
  try {
    const res = await customsearch.cse.list({
      cx: GOOGLE_SEARCH_ENGINE_ID,
      q: query,
      key: GOOGLE_API_KEY,
    });

    // Ensure that 'items' is present in the response
    if (!res.data || !res.data.items) {
      throw new Error("No items found in the response");
    }

    // Map through the items to extract relevant details
    return res.data.items.map((item) => ({
      url: item.link,
      similarityScore: 0.85, // Placeholder score; update logic as needed
      detectionDate: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error searching Google Custom Search:", error);
    throw new Error("Error searching Google Custom Search");
  }
}

async function fetchWebsiteContent(url) {
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
}

async function analyzeWebsite(url, referenceContent) {
  try {
    // Fetch website content
    const websiteContent = await fetchWebsiteContent(url);
    const $ = cheerio.load(websiteContent);
    const bodyText = $("body").text();

    // Calculate similarity score
    const similarityScore = stringSimilarity.compareTwoStrings(
      bodyText,
      referenceContent
    );
    const impactScore = Math.min(100, bodyText.length / 100);

    // Get similar content details
    const similarContentDetails = await getSimilarContentDetails(bodyText);

    return {
      domain: url,
      similarityScore,
      impactScore,
      similarContentDetails,
      analysisDate: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error analyzing website:", error);
    throw new Error("Content analysis failed");
  }
}

async function getSimilarContentDetails(content) {
  try {
    // Limit query length to 512 characters
    const query = encodeURIComponent(content.substring(0, 512));
    const similarContent = await fetchSimilarContentFromGoogle(query);

    return similarContent;
  } catch (error) {
    console.error("Error getting similar content details:", error);
    throw new Error("Error getting similar content details");
  }
}

module.exports = { analyzeWebsite };
