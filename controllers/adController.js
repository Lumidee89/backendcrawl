const Ad = require('../models/Ad');

const generateAdSuggestions = (domain) => {
  const isEcommerce = domain.includes('shop') || domain.includes('store');
  const isBlog = domain.includes('blog') || domain.includes('write');
  const isNews = domain.includes('news') || domain.includes('daily');
  const isTechnology = domain.includes('tech') || domain.includes('gadget');

  if (isEcommerce) {
    return {
      domain,
      adSlots: [
        { position: 'Product Page Header', size: '728x90', recommended: true },
        { position: 'Sidebar', size: '300x600', recommended: true },
        { position: 'Footer', size: '728x90', recommended: false }
      ]
    };
  } else if (isBlog) {
    return {
      domain,
      adSlots: [
        { position: 'Homepage Header', size: '728x90', recommended: true },
        { position: 'Sidebar', size: '300x250', recommended: true },
        { position: 'Inline Content', size: '468x60', recommended: false }
      ]
    };
  } else if (isNews) {
    return {
      domain,
      adSlots: [
        { position: 'Top Header', size: '970x90', recommended: true },
        { position: 'Sidebar', size: '300x250', recommended: true },
        { position: 'Article Footer', size: '728x90', recommended: false }
      ]
    };
  } else if (isTechnology) {
    return {
      domain,
      adSlots: [
        { position: 'Homepage Banner', size: '970x250', recommended: true },
        { position: 'Sidebar', size: '300x600', recommended: true },
        { position: 'Between Sections', size: '728x90', recommended: true }
      ]
    };
  } else {
    return {
      domain,
      adSlots: [
        { position: 'Homepage Header', size: '728x90', recommended: true },
        { position: 'Sidebar', size: '300x250', recommended: false },
        { position: 'Footer', size: '728x90', recommended: true }
      ]
    };
  }
};
  
const generateAdMetrics = (domain) => {
  const randomFactor = Math.random() * 0.5;
  const baseImpressions = domain.includes('blog') ? 5000 : 10000;

  return {
    domain,
    metrics: {
      impressions: Math.floor(baseImpressions * (1 + randomFactor)),
      clicks: Math.floor(200 * (1 + randomFactor)),
      ctr: parseFloat((2.0 * (1 + randomFactor)).toFixed(2)),
      revenue: parseFloat((100.50 * (1 + randomFactor)).toFixed(2))
    }
  };
};

  
const recommendAdPlacements = (domain) => {
  const isContentHeavy = domain.includes('blog') || domain.includes('news');
  return {
    domain,
    placements: isContentHeavy
      ? [
          { page: 'Homepage', recommendation: 'Use a prominent header banner to capture attention.' },
          { page: 'Blog Post', recommendation: 'Sidebar ads work well for long content.' },
          { page: 'Article Page', recommendation: 'Inline ads within the content can boost engagement.' }
        ]
      : [
          { page: 'Homepage', recommendation: 'Large banner ads on the header for visibility.' },
          { page: 'Product Page', recommendation: 'Mid-content ads to target active shoppers.' },
          { page: 'Checkout Page', recommendation: 'Offer discounts with strategically placed ads.' }
        ]
  };
};
  
exports.analyzeAds = async (req, res) => {
  const { domain } = req.params;

  if (!domain) {
    return res.status(400).json({ msg: 'Domain name is required' });
  }

  try {
    const adSuggestions = generateAdSuggestions(domain);
    const adMetrics = generateAdMetrics(domain);
    const adPlacements = recommendAdPlacements(domain);

    const adData = new Ad({
      domain,
      adSlots: adSuggestions.adSlots,
      metrics: adMetrics.metrics,
      placements: adPlacements.placements
    });
    await adData.save();

    res.status(200).json({
      msg: 'Ad analysis completed successfully',
      data: {
        adSuggestions,
        adMetrics,
        adPlacements
      }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
