const express = require("express");
const router = express.Router();
const { analyzeWebsite } = require("../controllers/contentAnalysis");

router.get("/analyze", async (req, res) => {
  const { url, referenceContent } = req.body;

  if (!url || !referenceContent) {
    return res
      .status(400)
      .json({ error: "URL and reference content are required" });
  }

  try {
    const result = await analyzeWebsite(url, referenceContent);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error analyzing website", details: error.message });
  }
});

module.exports = router;
