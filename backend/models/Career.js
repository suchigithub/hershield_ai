const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

// ── Resume model ────────────────────────────────
const resumes = () => db.get('resumes');

const Resume = {
  findByUser(userId) {
    return resumes().filter({ user: userId }).value().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },
  findById(id) { return resumes().find({ _id: id }).value() || null; },
  create({ user, name, email, phone, summary, skills, experience, education, certifications }) {
    const now = new Date().toISOString();
    const r = {
      _id: uuidv4(), user, name: (name || '').trim(), email: (email || '').trim(), phone: (phone || '').trim(),
      summary: (summary || '').trim(), skills: skills || [], experience: experience || [], education: education || [],
      certifications: certifications || [], createdAt: now, updatedAt: now,
    };
    resumes().push(r).write();
    return r;
  },
  update(id, updates) {
    const r = resumes().find({ _id: id }); if (!r.value()) return null;
    updates.updatedAt = new Date().toISOString();
    r.assign(updates).write(); return r.value();
  },
  delete(id) {
    const r = resumes().find({ _id: id }).value(); if (!r) return null;
    resumes().remove({ _id: id }).write(); return r;
  },
};

// ── Mentor Connection model ─────────────────────
const connections = () => db.get('mentorConnections');

const MentorConnection = {
  findByUser(userId) { return connections().filter({ user: userId }).value(); },
  findById(id) { return connections().find({ _id: id }).value() || null; },
  create({ user, mentorId, mentorName, speciality, message }) {
    const c = {
      _id: uuidv4(), user, mentorId, mentorName, speciality,
      message: (message || '').trim(), status: 'pending', createdAt: new Date().toISOString(),
    };
    connections().push(c).write(); return c;
  },
  updateStatus(id, status) {
    const c = connections().find({ _id: id }); if (!c.value()) return null;
    c.assign({ status }).write(); return c.value();
  },
};

// ── Community Post model ────────────────────────
const posts = () => db.get('communityPosts');

const CommunityPost = {
  findAll(category) {
    let list = posts().value();
    if (category) list = list.filter((p) => p.category === category);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  findById(id) { return posts().find({ _id: id }).value() || null; },
  create({ user, userName, title, content, category }) {
    const p = {
      _id: uuidv4(), user, userName: userName || 'Anonymous',
      title: (title || '').trim(), content: (content || '').trim(),
      category: (category || 'general').toLowerCase(), likes: 0, replies: [],
      createdAt: new Date().toISOString(),
    };
    posts().push(p).write(); return p;
  },
  addReply(postId, { user, userName, content }) {
    const p = posts().find({ _id: postId }); if (!p.value()) return null;
    const reply = { _id: uuidv4(), user, userName: userName || 'Anonymous', content: content.trim(), createdAt: new Date().toISOString() };
    const cur = p.value();
    p.assign({ replies: [...cur.replies, reply] }).write();
    return p.value();
  },
  like(postId) {
    const p = posts().find({ _id: postId }); if (!p.value()) return null;
    p.assign({ likes: p.value().likes + 1 }).write(); return p.value();
  },
};

module.exports = { Resume, MentorConnection, CommunityPost };
