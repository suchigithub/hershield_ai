const { getAgeGroups, getSchemes, getSchemeById, checkEligibility, getInsurance, getRights } = require('../services/schemesService');

exports.getAgeGroups = (req, res) => {
  try { return res.json({ ageGroups: getAgeGroups() }); }
  catch (err) { console.error('[HerAdhikar]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getSchemes = (req, res) => {
  try {
    const { ageGroup, category, type } = req.query;
    return res.json({ schemes: getSchemes({ ageGroup, category, type }) });
  } catch (err) { console.error('[HerAdhikar]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getSchemeDetail = (req, res) => {
  try {
    const scheme = getSchemeById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found.' });
    return res.json({ scheme });
  } catch (err) { console.error('[HerAdhikar]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.checkEligibility = (req, res) => {
  try {
    const { age, income, caste, location } = req.body;
    if (!age) return res.status(400).json({ message: 'Age is required.' });
    const results = checkEligibility({ age, income, caste, location });
    return res.json({
      message: `Found ${results.length} scheme(s) you may be eligible for.`,
      results,
    });
  } catch (err) { console.error('[HerAdhikar]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getInsurance = (req, res) => {
  try { return res.json({ insurance: getInsurance(req.query.type) }); }
  catch (err) { console.error('[HerAdhikar]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getRights = (req, res) => {
  try { return res.json({ rights: getRights(req.query.category) }); }
  catch (err) { console.error('[HerAdhikar]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};
