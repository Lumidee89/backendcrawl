const dns = require("dns").promises;
const axios = require("axios");

let ipData = {};
let blockedIps = new Set();

exports.analyzeWebsite = async (req, res) => {
  const { website } = req.body;

  if (!website) {
    return res.status(400).json({ message: "Please provide a valid website URL" });
  }

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  if (!urlPattern.test(website)) {
    return res.status(400).json({ message: "Invalid website URL" });
  }

  const cleanWebsite = website.replace(/^https?:\/\//, "").replace(/\/$/, "");

  try {
    const { address } = await dns.lookup(cleanWebsite);

    const normalizedAddress = address.includes("::") ? address.split("%")[0] : address;

    if (blockedIps.has(normalizedAddress)) {
      return res.status(403).json({ message: "This IP is blocked" });
    }

    let locationData = {};
    try {
      const locationResponse = await axios.get(`https://ipapi.co/${normalizedAddress}/json/`);
      locationData = locationResponse.data;
    } catch (err) {
      console.error("Error fetching location data:", err.message);
      locationData = { error: "Failed to fetch location data" };
    }

    if (!ipData[cleanWebsite]) {
      ipData[cleanWebsite] = {
        ipAddress: normalizedAddress,
        accessCount: 0,
        lastAccessed: new Date(),
        logs: [],
        location: locationData,
      };
    }

    ipData[cleanWebsite].accessCount++;
    ipData[cleanWebsite].lastAccessed = new Date();
    ipData[cleanWebsite].logs.push({
      ipAddress: normalizedAddress,
      timestamp: new Date(),
      location: locationData,
    });

    return res.json({
      message: "Website analyzed successfully",
      data: ipData[cleanWebsite],
    });
  } catch (error) {
    console.error("Error analyzing website:", { website, error: error.message });
    return res.status(500).json({
      message: "An error occurred while analyzing the website",
      error: error.message,
    });
  }
};

exports.getIpData = (req, res) => {
  const { website } = req.query;

  if (Object.keys(ipData).length === 0) {
    return res.status(404).json({ message: "No IP data available yet" });
  }

  if (website) {
    const data = ipData[website];
    if (!data) {
      return res.status(404).json({ message: `No data found for website: ${website}` });
    }
    return res.json({ website, data });
  }

  res.json({ ipData });
};

exports.blockedIps = blockedIps;

const isValidIp = (ipAddress) => {
  const ipPattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  return ipPattern.test(ipAddress);
};

exports.blockIp = (req, res) => {
  const { ipAddress } = req.body;

  if (!ipAddress || !isValidIp(ipAddress)) {
    return res.status(400).json({ message: "Please provide a valid IP address" });
  }

  if (blockedIps.has(ipAddress)) {
    return res.status(409).json({ message: `IP address ${ipAddress} is already blocked` });
  }

  blockedIps.add(ipAddress);

  res.json({
    message: `IP address ${ipAddress} has been blocked successfully`,
  });
};

exports.getBlockedIps = (req, res) => {
  if (blockedIps.size === 0) {
    return res.status(404).json({ message: "No IP addresses are currently blocked" });
  }
  res.json({ blockedIps: Array.from(blockedIps) });
};

exports.unblockIp = (req, res) => {
  const { ipAddress } = req.body;

  if (!ipAddress || !isValidIp(ipAddress)) {
    return res.status(400).json({ message: "Please provide a valid IP address" });
  }

  if (!blockedIps.has(ipAddress)) {
    return res.status(404).json({ message: "IP address is not blocked" });
  }

  blockedIps.delete(ipAddress);

  res.json({ message: `IP address ${ipAddress} has been unblocked` });
};