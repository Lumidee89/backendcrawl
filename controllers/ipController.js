const dns = require("dns");
const axios = require("axios");

let ipData = {}; // To store detected IP information
let blockedIps = new Set(); // To store blocked IPs

let websiteData = {}; // To store website data with multiple IPs information

// Analyze the website and store IP data along with location information
exports.analyzeWebsite = async (req, res) => {
  const { website } = req.body;

  if (!website) {
    return res
      .status(400)
      .json({ message: "Please provide a valid website URL" });
  }

  try {
    dns.lookup(website, async (err, address, family) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error resolving website IP", error: err });
      }

      if (!websiteData[website]) {
        websiteData[website] = {
          totalAccessCount: 0,
          ipDetails: {},
        };
      }

      // Fetch location data based on IP address
      const locationResponse = await axios.get(
        `https://ipapi.co/${address}/json/`
      );
      const locationData = locationResponse.data;

      if (!websiteData[website].ipDetails[address]) {
        websiteData[website].ipDetails[address] = {
          ipAddress: address,
          accessCount: 0,
          lastAccessed: new Date(),
          logs: [],
          location: locationData,
        };
      }

      websiteData[website].totalAccessCount++;
      websiteData[website].ipDetails[address].accessCount++;
      websiteData[website].ipDetails[address].lastAccessed = new Date();
      websiteData[website].ipDetails[address].logs.push({
        timestamp: new Date(),
      });

      res.json({
        message: "Website analyzed successfully",
        data: websiteData[website],
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while analyzing the website",
      error,
    });
  }
};

// Get all IP data that has been detected
exports.getIpData = (req, res) => {
  if (Object.keys(ipData).length === 0) {
    return res.status(404).json({ message: "No IP data available yet" });
  }

  res.json({ ipData });
};

exports.blockedIps = blockedIps;

// Block an IP address
exports.blockIp = (req, res) => {
  const { ipAddress } = req.body;

  if (!ipAddress) {
    return res
      .status(400)
      .json({ message: "Please provide a valid IP address" });
  }

  // Add the IP address to the blocked list
  blockedIps.add(ipAddress);

  res.json({
    message: `IP address ${ipAddress} has been blocked successfully`,
  });
};

// Get all blocked IP addresses
exports.getBlockedIps = (req, res) => {
  res.json({ blockedIps: Array.from(blockedIps) });
};

// Unblock an IP address
exports.unblockIp = (req, res) => {
  const { ipAddress } = req.body;

  if (!ipAddress) {
    return res
      .status(400)
      .json({ message: "Please provide a valid IP address" });
  }

  if (!blockedIps.has(ipAddress)) {
    return res.status(404).json({ message: "IP address is not blocked" });
  }

  // Remove the IP from the blocked list
  blockedIps.delete(ipAddress);

  res.json({ message: `IP address ${ipAddress} has been unblocked` });
};
