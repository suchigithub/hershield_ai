const { getScholarships, getCourses, getSkillPrograms, getCertifications, getFamilyLearning } = require('../services/educationService');

exports.getScholarships = (req, res) => {
  try { return res.json({ scholarships: getScholarships(req.query.type) }); }
  catch (err) { console.error('[HerShiksha]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getCourses = (req, res) => {
  try { return res.json({ courses: getCourses(req.query.category) }); }
  catch (err) { console.error('[HerShiksha]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getSkillPrograms = (req, res) => {
  try { return res.json({ programs: getSkillPrograms() }); }
  catch (err) { console.error('[HerShiksha]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getCertifications = (req, res) => {
  try { return res.json({ certifications: getCertifications() }); }
  catch (err) { console.error('[HerShiksha]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getFamilyLearning = (req, res) => {
  try { return res.json({ ideas: getFamilyLearning() }); }
  catch (err) { console.error('[HerShiksha]', err); return res.status(500).json({ message: 'Internal server error.' }); }
};
