const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * Transaction model — income / expense tracking.
 * Shape: { _id, user, type, category, amount, currency, note, date, createdAt }
 */
const txns = () => db.get('transactions');

const Transaction = {
  findByUser(userId, filters = {}) {
    let results = txns().filter({ user: userId });

    if (filters.type) {
      results = results.filter({ type: filters.type });
    }

    let list = results.value();

    // Date range filtering
    if (filters.from) {
      list = list.filter((t) => t.date >= filters.from);
    }
    if (filters.to) {
      list = list.filter((t) => t.date <= filters.to);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    return list;
  },

  findById(id) {
    return txns().find({ _id: id }).value() || null;
  },

  create({ user, type, category, amount, currency, note, date }) {
    const now = new Date().toISOString();
    const txn = {
      _id: uuidv4(),
      user,
      type, // 'income' | 'expense'
      category: category || 'general',
      amount: Number(amount),
      currency: currency || 'INR',
      note: (note || '').trim(),
      date: date || now,
      createdAt: now,
    };
    txns().push(txn).write();
    return txn;
  },

  delete(id) {
    const txn = txns().find({ _id: id }).value();
    if (!txn) return null;
    txns().remove({ _id: id }).write();
    return txn;
  },

  /**
   * Get summary: total income, total expense, balance, by-category breakdown.
   */
  getSummary(userId, filters = {}) {
    const list = this.findByUser(userId, filters);
    let totalIncome = 0;
    let totalExpense = 0;
    const byCategory = {};

    list.forEach((t) => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;

      if (!byCategory[t.category]) byCategory[t.category] = 0;
      byCategory[t.category] += t.type === 'expense' ? t.amount : 0;
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byCategory,
      transactionCount: list.length,
    };
  },
};

module.exports = Transaction;
