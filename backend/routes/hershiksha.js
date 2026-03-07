const express = require('express');
const authMiddleware = require('../middleware/auth');
const c = require('../controllers/hershikshaController');

const router = express.Router();
router.use(authMiddleware);

router.get('/scholarships', c.getScholarships);
router.get('/courses', c.getCourses);
router.get('/skill-programs', c.getSkillPrograms);
router.get('/certifications', c.getCertifications);
router.get('/family-learning', c.getFamilyLearning);

module.exports = router;
