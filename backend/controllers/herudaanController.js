const User = require('../models/User');
const { Resume, MentorConnection, CommunityPost } = require('../models/Career');
const { getCourses, getJobs, getMentors, getMentorById, getHigherStudies, getCommunityPrograms } = require('../services/careerService');

// ╔══════════════════════════════════════════════╗
// ║  RESUME BUILDER                               ║
// ╚══════════════════════════════════════════════╝

exports.getResumes = (req, res) => {
  try { return res.json({ resumes: Resume.findByUser(req.user.id) }); }
  catch (err) { console.error('[HerUdaan] getResumes:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.createResume = (req, res) => {
  try {
    const r = Resume.create({ user: req.user.id, ...req.body });
    return res.status(201).json({ message: 'Resume created! 📄', resume: r });
  } catch (err) { console.error('[HerUdaan] createResume:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.updateResume = (req, res) => {
  try {
    const r = Resume.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Resume not found.' });
    if (r.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    const updated = Resume.update(req.params.id, req.body);
    return res.json({ message: 'Resume updated.', resume: updated });
  } catch (err) { console.error('[HerUdaan] updateResume:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.deleteResume = (req, res) => {
  try {
    const r = Resume.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Resume not found.' });
    if (r.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    Resume.delete(req.params.id);
    return res.json({ message: 'Resume deleted.' });
  } catch (err) { console.error('[HerUdaan] deleteResume:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

// ╔══════════════════════════════════════════════╗
// ║  SKILL COURSES                                ║
// ╚══════════════════════════════════════════════╝

exports.getCourses = (req, res) => {
  try { return res.json({ courses: getCourses(req.query.category) }); }
  catch (err) { console.error('[HerUdaan] getCourses:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

// ╔══════════════════════════════════════════════╗
// ║  HIGHER STUDIES                               ║
// ╚══════════════════════════════════════════════╝

exports.getHigherStudies = (req, res) => {
  try { return res.json({ programs: getHigherStudies(req.query.category) }); }
  catch (err) { console.error('[HerUdaan] getHigherStudies:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

// ╔══════════════════════════════════════════════╗
// ║  JOB BOARD                                    ║
// ╚══════════════════════════════════════════════╝

exports.getJobs = (req, res) => {
  try {
    const { category, type, remote, returnFriendly } = req.query;
    return res.json({ jobs: getJobs({ category, type, remote: remote === 'true', returnFriendly: returnFriendly === 'true' }) });
  } catch (err) { console.error('[HerUdaan] getJobs:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

// ╔══════════════════════════════════════════════╗
// ║  MENTORSHIP                                   ║
// ╚══════════════════════════════════════════════╝

exports.getMentors = (req, res) => {
  try {
    const { speciality, available } = req.query;
    return res.json({ mentors: getMentors({ speciality, available: available === 'true' }) });
  } catch (err) { console.error('[HerUdaan] getMentors:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.connectMentor = (req, res) => {
  try {
    const { mentorId, message } = req.body;
    const mentor = getMentorById(mentorId);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found.' });
    if (!mentor.available) return res.status(400).json({ message: 'Mentor is not available right now.' });

    const conn = MentorConnection.create({
      user: req.user.id, mentorId: mentor.id, mentorName: mentor.name,
      speciality: mentor.speciality, message,
    });
    return res.status(201).json({ message: `Connection request sent to ${mentor.name}! 🧑‍🏫`, connection: conn });
  } catch (err) { console.error('[HerUdaan] connectMentor:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getMyMentorConnections = (req, res) => {
  try { return res.json({ connections: MentorConnection.findByUser(req.user.id) }); }
  catch (err) { console.error('[HerUdaan] getMyMentorConnections:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

// ╔══════════════════════════════════════════════╗
// ║  COMMUNITY                                    ║
// ╚══════════════════════════════════════════════╝

exports.getCommunityPrograms = (req, res) => {
  try { return res.json({ programs: getCommunityPrograms() }); }
  catch (err) { console.error('[HerUdaan] getCommunityPrograms:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.getCommunityPosts = (req, res) => {
  try { return res.json({ posts: CommunityPost.findAll(req.query.category) }); }
  catch (err) { console.error('[HerUdaan] getCommunityPosts:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.createCommunityPost = (req, res) => {
  try {
    const user = User.findById(req.user.id);
    const post = CommunityPost.create({
      user: req.user.id, userName: user ? user.name.split(' ')[0] : 'Anonymous',
      title: req.body.title, content: req.body.content, category: req.body.category,
    });
    return res.status(201).json({ message: 'Post shared! 🤝', post });
  } catch (err) { console.error('[HerUdaan] createCommunityPost:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.replyCommunityPost = (req, res) => {
  try {
    const user = User.findById(req.user.id);
    const post = CommunityPost.addReply(req.params.id, {
      user: req.user.id, userName: user ? user.name.split(' ')[0] : 'Anonymous',
      content: req.body.content,
    });
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    return res.status(201).json({ message: 'Reply added.', post });
  } catch (err) { console.error('[HerUdaan] replyCommunityPost:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};

exports.likeCommunityPost = (req, res) => {
  try {
    const post = CommunityPost.like(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    return res.json({ likes: post.likes });
  } catch (err) { console.error('[HerUdaan] likeCommunityPost:', err); return res.status(500).json({ message: 'Internal server error.' }); }
};
