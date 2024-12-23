const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const stringSimilarity = require("string-similarity");
const { google } = require("googleapis");
const customsearch = google.customsearch("v1");
require('dotenv').config();

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_API_URL = process.env.SCRAPER_API_URL;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

async function fetchSimilarContentFromGoogle(query) {
  try {
    const res = await customsearch.cse.list({
      cx: GOOGLE_SEARCH_ENGINE_ID,
      q: query,
      key: GOOGLE_API_KEY,
    });

    if (!res.data || !res.data.items) {
      throw new Error("No items found in the response");
    }

    return res.data.items.map((item) => ({
      url: item.link,
      similarityScore: 0.85,
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
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    return response.data; 
  } catch (scraperError) {
    console.error(`ScraperAPI failed for ${url}. Switching to Puppeteer...`, scraperError.message);
    return await fetchWithPuppeteer(url);
  }
}

async function fetchWithPuppeteer(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], 
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" }); 
    const content = await page.content(); 
    return content;
  } catch (puppeteerError) {
    console.error(`Puppeteer failed for ${url}`, puppeteerError.message);
    throw new Error(`Both ScraperAPI and Puppeteer failed for ${url}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function analyzeWebsite(url, referenceContent) {
  try {
    const websiteContent = await fetchWebsiteContent(url);
    console.log("Website content successfully fetched.");

    const $ = cheerio.load(websiteContent);
    const bodyText = $("body").text();

    const similarityScore = stringSimilarity.compareTwoStrings(bodyText, referenceContent);
    const similarContentDetails = await getSimilarContentDetails(bodyText);

    return {
      domain: url,
      similarityScore,
      similarContentDetails,
      analysisDate: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to analyze website ${url}:`, error.message);
    throw new Error("Content analysis failed.");
  }
}

async function getSimilarContentDetails(content) {
  try {
    const query = encodeURIComponent(content.substring(0, 512));
    const similarContent = await fetchSimilarContentFromGoogle(query);
    console.log("Similar content fetched successfully from Google.");
    return similarContent;
  } catch (googleSearchError) {
    console.error("Google Custom Search failed. Attempting alternative content extraction...", googleSearchError.message);
    return await fetchSimilarContentWithPuppeteer(content);
  }
}

async function fetchSimilarContentWithPuppeteer(content) {
  const query = content.substring(0, 512); 
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"], 
    });
    const page = await browser.newPage();
    await page.goto(searchUrl, { waitUntil: "networkidle2" });
    const searchResults = await page.evaluate(() => {
      const results = [];
      const anchors = document.querySelectorAll("a");

      anchors.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("http")) {
          results.push({
            url: href,
            similarityScore: 0.75, 
            detectionDate: new Date().toISOString(),
          });
        }
      });
      return results;
    });
    console.log(`Puppeteer fetched ${searchResults.length} results.`);
    return searchResults;
  } catch (puppeteerError) {
    console.error("Puppeteer failed to fetch search results:", puppeteerError.message);
    throw new Error("Failed to retrieve similar content using Puppeteer.");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}


module.exports = { analyzeWebsite };
