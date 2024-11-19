const whois = require('whois');
const DomainDetails = require('../models/domainDetails');

exports.lookup = (req, res) => {
  const { domain } = req.params;

  if (!domain) {
    return res.status(400).json({ msg: 'Domain is required' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ msg: 'Unauthorized. Please login to save domain details' });
  }

  whois.lookup(domain, (err, data) => {
    if (err) {
      return res.status(500).json({ msg: 'Error performing WHOIS lookup', error: err });
    }

    const formattedData = formatWhoisData(data);

    const domainDetails = new DomainDetails({
      domain,
      whoisData: formattedData,
      user: req.user._id
    });

    domainDetails.save()
      .then(savedDomain => {
        res.status(200).json({ domain, whoisData: formattedData, savedDomain });
      })
      .catch(error => {
        console.error('Error saving domain details:', error);
        res.status(500).json({ msg: 'Error saving domain details to the database' });
      });
  });
};

const formatWhoisData = (data) => {
  const lines = data.split('\n');
  const formattedData = {};

  lines.forEach(line => {
    const [key, ...value] = line.split(':');
    const formattedKey = key ? key.trim() : '';
    const formattedValue = value.join(':').trim();

    if (formattedKey) {
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
