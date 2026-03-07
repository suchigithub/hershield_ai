const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const c = require('../controllers/heradhikarController');

const router = express.Router();
router.use(authMiddleware);

router.get('/age-groups', c.getAgeGroups);
router.get('/schemes', c.getSchemes);
router.get('/schemes/:id', c.getSchemeDetail);
router.post('/eligibility', [body('age').isInt({ min: 0, max: 120 }).withMessage('Valid age required.')], validate, c.checkEligibility);
router.get('/insurance', c.getInsurance);
router.get('/rights', c.getRights);

module.exports = router;
