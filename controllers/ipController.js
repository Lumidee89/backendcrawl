import { promises as dns } from 'dns';
import axios from 'axios';

let ipData = {};
let blockedIps = new Set();

export const analyzeWebsite = async (req, res) => {
  const { website } = req.body;

  if (!website) {
    return res.status(400).json({ message: "Please provide a valid website URL" });
  }

  try {
    const { address } = await dns.lookup(website);

    if (blockedIps.has(address)) {
      return res.status(403).json({ message: "This IP is blocked" });
    }

    const locationResponse = await axios.get(`https://ipapi.co/${address}/json/`);
    const locationData = locationResponse.data;

    if (!ipData[website]) {
      ipData[website] = {
        ipAddress: address,
        accessCount: 0,
        lastAccessed: new Date(),
        logs: [],
        location: locationData,
      };
    }

    ipData[website].accessCount++;
    ipData[website].lastAccessed = new Date();
    ipData[website].logs.push({
      ipAddress: address,
      timestamp: new Date(),
      location: locationData,
    });

    return res.json({
      message: "Website analyzed successfully",
      data: ipData[website],
    });

  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while analyzing the website",
      error: error.message,
    });
  }
};

export const getIpData = (req, res) => {
  if (Object.keys(ipData).length === 0) {
    return res.status(404).json({ message: "No IP data available yet" });
  }

  res.json({ ipData });
};

export const blockIp = (req, res) => {
  const { ipAddress } = req.body;

  if (!ipAddress) {
    return res.status(400).json({ message: "Please provide a valid IP address" });
  }

  blockedIps.add(ipAddress);

  res.json({
    message: `IP address ${ipAddress} has been blocked successfully`,
  });
};

export const getBlockedIps = (req, res) => {
  res.json({ blockedIps: Array.from(blockedIps) });
};

export const unblockIp = (req, res) => {
  const { ipAddress } = req.body;

  if (!ipAddress) {
    return res.status(400).json({ message: "Please provide a valid IP address" });
  }

  if (!blockedIps.has(ipAddress)) {
    return res.status(404).json({ message: "IP address is not blocked" });
  }

  blockedIps.delete(ipAddress);

  res.json({ message: `IP address ${ipAddress} has been unblocked` });
};

export { blockedIps };