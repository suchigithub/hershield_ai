const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * SupportGroup model — women-only anonymous support groups.
 * Shape: { _id, name, description, category, members[], createdAt }
 *
 * GroupMessage shape: { _id, groupId, user, userName, message, createdAt }
 */
const groups = () => db.get('supportGroups');
const messages = () => db.get('groupMessages');

const SupportGroup = {
  findAll() {
    return groups().value();
  },

  findById(id) {
    return groups().find({ _id: id }).value() || null;
  },

  create({ name, description, category }) {
    const group = {
      _id: uuidv4(),
      name: name.trim(),
      description: (description || '').trim(),
      category: (category || 'general').toLowerCase(),
      members: [],
      createdAt: new Date().toISOString(),
    };
    groups().push(group).write();
    return group;
  },

  join(groupId, userId) {
    const group = groups().find({ _id: groupId });
    if (!group.value()) return null;
    const current = group.value();
    if (!current.members.includes(userId)) {
      group.assign({ members: [...current.members, userId] }).write();
    }
    return group.value();
  },

  leave(groupId, userId) {
    const group = groups().find({ _id: groupId });
    if (!group.value()) return null;
    const current = group.value();
    group.assign({ members: current.members.filter((m) => m !== userId) }).write();
    return group.value();
  },

  // ── Messages ──
  getMessages(groupId, limit = 50) {
    return messages()
      .filter({ groupId })
      .value()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-limit);
  },

  postMessage({ groupId, user, userName, message }) {
    const msg = {
      _id: uuidv4(),
      groupId,
      user,
      userName: userName || 'Anonymous',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    messages().push(msg).write();
    return msg;
  },
};

module.exports = SupportGroup;
