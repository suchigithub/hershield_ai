const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const c = require('../controllers/herudaanController');

const router = express.Router();
router.use(authMiddleware);

// ── Resume Builder ────────────────────────────
router.get('/resumes', c.getResumes);
router.post('/resumes', [body('name').trim().notEmpty().withMessage('Name required.')], validate, c.createResume);
router.put('/resumes/:id', c.updateResume);
router.delete('/resumes/:id', c.deleteResume);

// ── Skill Courses ─────────────────────────────
router.get('/courses', c.getCourses);

// ── Higher Studies ────────────────────────────
router.get('/higher-studies', c.getHigherStudies);

// ── Job Board ─────────────────────────────────
router.get('/jobs', c.getJobs);

// ── Mentorship ────────────────────────────────
router.get('/mentors', c.getMentors);
router.get('/mentors/connections', c.getMyMentorConnections);
router.post('/mentors/connect', [body('mentorId').trim().notEmpty(), body('message').optional().trim()], validate, c.connectMentor);

// ── Community ─────────────────────────────────
router.get('/community/programs', c.getCommunityPrograms);
router.get('/community/posts', c.getCommunityPosts);
router.post('/community/posts', [body('title').trim().notEmpty(), body('content').trim().notEmpty(), body('category').optional().trim()], validate, c.createCommunityPost);
router.post('/community/posts/:id/reply', [body('content').trim().notEmpty()], validate, c.replyCommunityPost);
router.post('/community/posts/:id/like', c.likeCommunityPost);

module.exports = router;
