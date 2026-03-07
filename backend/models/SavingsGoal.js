const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');

/**
 * SavingsGoal model — micro-savings tracker.
 * Shape: { _id, user, name, targetAmount, savedAmount, currency, deposits[], createdAt, updatedAt }
 */
const goals = () => db.get('savingsGoals');

const SavingsGoal = {
  findByUser(userId) {
    return goals().filter({ user: userId }).value();
  },

  findById(id) {
    return goals().find({ _id: id }).value() || null;
  },

  create({ user, name, targetAmount, currency }) {
    const now = new Date().toISOString();
    const goal = {
      _id: uuidv4(),
      user,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      savedAmount: 0,
      currency: currency || 'INR',
      deposits: [],
      createdAt: now,
      updatedAt: now,
    };
    goals().push(goal).write();
    return goal;
  },

  addDeposit(goalId, amount, method = 'manual', upiRef = null) {
    const goal = goals().find({ _id: goalId });
    if (!goal.value()) return null;

    const deposit = {
      _id: uuidv4(),
      amount: Number(amount),
      method, // 'manual' | 'upi_gpay' | 'upi_bharatpe' | 'upi_phonepe'
      upiRef,
      date: new Date().toISOString(),
    };

    const current = goal.value();
    const newSaved = current.savedAmount + Number(amount);
    goal.assign({
      savedAmount: newSaved,
      deposits: [...current.deposits, deposit],
      updatedAt: new Date().toISOString(),
    }).write();

    return goal.value();
  },

  update(id, updates) {
    const goal = goals().find({ _id: id });
    if (!goal.value()) return null;
    updates.updatedAt = new Date().toISOString();
    goal.assign(updates).write();
    return goal.value();
  },

  delete(id) {
    const goal = goals().find({ _id: id }).value();
    if (!goal) return null;
    goals().remove({ _id: id }).write();
    return goal;
  },
};

module.exports = SavingsGoal;
