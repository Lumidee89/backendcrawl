import axios from "axios";
import * as cheerio from 'cheerio';
import stringSimilarity from "string-similarity";
import { google } from "googleapis";
const { customsearch } = google;
import dotenv from 'dotenv';
dotenv.config();

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_API_URL = process.env.SCRAPER_API_URL;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

const fetchSimilarContentFromGoogle = async (query) => {
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

const analyzeWebsite = async (url, referenceContent) => {
  try {
    const websiteContent = await fetchWebsiteContent(url);
    const $ = cheerio.load(websiteContent);
    const bodyText = $("body").text();

    const similarityScore = stringSimilarity.compareTwoStrings(
      bodyText,
      referenceContent
    );
    const impactScore = Math.min(100, bodyText.length / 100);

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
};

const getSimilarContentDetails = async (content) => {
  try {
    const query = encodeURIComponent(content.substring(0, 512));
    const similarContent = await fetchSimilarContentFromGoogle(query);

    return similarContent;
  } catch (error) {
    console.error("Error getting similar content details:", error);
    throw new Error("Error getting similar content details");
  }
};

export { analyzeWebsite };