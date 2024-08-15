const whois = require('whois');

exports.lookup = (req, res) => {
  const { domain } = req.params;

  if (!domain) {
    return res.status(400).json({ msg: 'Domain is required' });
  }

  whois.lookup(domain, (err, data) => {
    if (err) {
      return res.status(500).json({ msg: 'Error performing WHOIS lookup', error: err });
    }

    // Format the raw data into a structured JSON object
    const formattedData = formatWhoisData(data);

    res.status(200).json({ domain, whoisData: formattedData });
  });
};

// Helper function to format WHOIS data
const formatWhoisData = (data) => {
  const lines = data.split('\n');
  const formattedData = {};

  lines.forEach(line => {
    const [key, ...value] = line.split(':');
    const formattedKey = key ? key.trim() : '';
    const formattedValue = value.join(':').trim();

    if (formattedKey) {
      // Handle known WHOIS fields
      switch (formattedKey) {
        case 'Domain Name':
        case 'Registrar':
        case 'Creation Date':
        case 'Updated Date':
        case 'Expiration Date':
        case 'Registrant Name':
        case 'Registrant Organization':
        case 'Registrant Street':
        case 'Registrant City':
        case 'Registrant State':
        case 'Registrant Postal Code':
        case 'Registrant Country':
        case 'Name Server':
        case 'Status':
          formattedData[formattedKey] = formattedValue;
          break;
        default:
          if (!formattedData['Additional Information']) {
            formattedData['Additional Information'] = {};
          }
          formattedData['Additional Information'][formattedKey] = formattedValue;
          break;
      }
    }
  });

  return cleanUpData(formattedData);
};

// Helper function to clean up and format the data
const cleanUpData = (data) => {
  const cleanedData = {};

  Object.keys(data).forEach(key => {
    if (data[key] && typeof data[key] === 'object') {
      cleanedData[key] = {};
      Object.keys(data[key]).forEach(subKey => {
        if (data[key][subKey]) {
          cleanedData[key][subKey] = data[key][subKey];
        }
      });
    } else if (data[key]) {
      cleanedData[key] = data[key];
    }
  });

  return cleanedData;
};