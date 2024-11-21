const express = require("express");
const router = express.Router();
const { analyzeWebsite } = require("../controllers/contentAnalysis");

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

router.post("/analyze", async (req, res) => {
  const { url, referenceContent } = req.body;

  if (!url || !referenceContent) {
    return res
      .status(400)
      .json({ error: "URL and reference content are required" });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    const result = await analyzeWebsite(url, referenceContent);
    res.json(result);
  } catch (error) {
    console.error("Error analyzing website:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
