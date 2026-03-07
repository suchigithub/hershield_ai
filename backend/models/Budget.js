const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * Budget model — monthly spending limits per category.
 * Shape: { _id, user, category, limit, month, spent, createdAt, updatedAt }
 */
const budgets = () => db.get('budgets');

const Budget = {
  findByUser(userId, month) {
    const query = { user: userId };
    if (month) query.month = month;
    return budgets().filter(query).value();
  },

  findById(id) {
    return budgets().find({ _id: id }).value() || null;
  },

  findOne(query) {
    return budgets().find(query).value() || null;
  },

  create({ user, category, limit, month }) {
    const now = new Date().toISOString();
    const budget = {
      _id: uuidv4(),
      user,
      category: category.toLowerCase().trim(),
      limit: Number(limit),
      month: month || new Date().toISOString().slice(0, 7), // 'YYYY-MM'
      spent: 0,
      createdAt: now,
      updatedAt: now,
    };
    budgets().push(budget).write();
    return budget;
  },

  addSpending(id, amount) {
    const budget = budgets().find({ _id: id });
    if (!budget.value()) return null;
    const current = budget.value();
    budget.assign({
      spent: current.spent + Number(amount),
      updatedAt: new Date().toISOString(),
    }).write();
    return budget.value();
  },

  update(id, updates) {
    const budget = budgets().find({ _id: id });
    if (!budget.value()) return null;
    updates.updatedAt = new Date().toISOString();
    budget.assign(updates).write();
    return budget.value();
  },

  delete(id) {
    const budget = budgets().find({ _id: id }).value();
    if (!budget) return null;
    budgets().remove({ _id: id }).write();
    return budget;
  },
};

module.exports = Budget;
