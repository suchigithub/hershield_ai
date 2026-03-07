const SavingsGoal = require('../models/SavingsGoal');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { generateUPILink, verifyPayment, getFinanceTips } = require('../services/upiService');

// ╔══════════════════════════════════════════════╗
// ║  SAVINGS GOALS                               ║
// ╚══════════════════════════════════════════════╝

// GET /api/herpaisa/goals
exports.getGoals = (req, res) => {
  try {
    const goals = SavingsGoal.findByUser(req.user.id);
    return res.json({ goals });
  } catch (err) {
    console.error('[HerPaisa] getGoals error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herpaisa/goals
exports.createGoal = (req, res) => {
  try {
    const { name, targetAmount, currency } = req.body;
    const goal = SavingsGoal.create({
      user: req.user.id,
      name,
      targetAmount,
      currency,
    });
    return res.status(201).json({ message: 'Savings goal created.', goal });
  } catch (err) {
    console.error('[HerPaisa] createGoal error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herpaisa/goals/:id/deposit
exports.depositToGoal = (req, res) => {
  try {
    const { id } = req.params;
    const { amount, method } = req.body;

    const goal = SavingsGoal.findById(id);
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });
    if (goal.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });

    const updated = SavingsGoal.addDeposit(id, amount, method || 'manual');

    // Also record as a transaction
    Transaction.create({
      user: req.user.id,
      type: 'income',
      category: 'savings',
      amount,
      note: `Deposit to: ${goal.name}`,
    });

    return res.json({ message: 'Deposit recorded.', goal: updated });
  } catch (err) {
    console.error('[HerPaisa] depositToGoal error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/herpaisa/goals/:id
exports.deleteGoal = (req, res) => {
  try {
    const goal = SavingsGoal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });
    if (goal.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    SavingsGoal.delete(req.params.id);
    return res.json({ message: 'Goal deleted.' });
  } catch (err) {
    console.error('[HerPaisa] deleteGoal error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  TRANSACTIONS                                 ║
// ╚══════════════════════════════════════════════╝

// GET /api/herpaisa/transactions
exports.getTransactions = (req, res) => {
  try {
    const { type, from, to } = req.query;
    const transactions = Transaction.findByUser(req.user.id, { type, from, to });
    return res.json({ transactions });
  } catch (err) {
    console.error('[HerPaisa] getTransactions error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herpaisa/transactions
exports.createTransaction = (req, res) => {
  try {
    const { type, category, amount, note, date } = req.body;
    const txn = Transaction.create({
      user: req.user.id,
      type,
      category,
      amount,
      note,
      date,
    });

    // If it's an expense, update matching budget
    if (type === 'expense' && category) {
      const month = (date || new Date().toISOString()).slice(0, 7);
      const budget = Budget.findOne({ user: req.user.id, category: category.toLowerCase(), month });
      if (budget) {
        Budget.addSpending(budget._id, amount);
      }
    }

    return res.status(201).json({ message: 'Transaction recorded.', transaction: txn });
  } catch (err) {
    console.error('[HerPaisa] createTransaction error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/herpaisa/transactions/summary
exports.getTransactionSummary = (req, res) => {
  try {
    const { from, to } = req.query;
    const summary = Transaction.getSummary(req.user.id, { from, to });
    return res.json({ summary });
  } catch (err) {
    console.error('[HerPaisa] getTransactionSummary error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/herpaisa/transactions/:id
exports.deleteTransaction = (req, res) => {
  try {
    const txn = Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ message: 'Transaction not found.' });
    if (txn.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    Transaction.delete(req.params.id);
    return res.json({ message: 'Transaction deleted.' });
  } catch (err) {
    console.error('[HerPaisa] deleteTransaction error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  BUDGETS                                      ║
// ╚══════════════════════════════════════════════╝

// GET /api/herpaisa/budgets
exports.getBudgets = (req, res) => {
  try {
    const { month } = req.query;
    const budgets = Budget.findByUser(req.user.id, month);
    return res.json({ budgets });
  } catch (err) {
    console.error('[HerPaisa] getBudgets error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herpaisa/budgets
exports.createBudget = (req, res) => {
  try {
    const { category, limit, month } = req.body;

    // Check for duplicate
    const existing = Budget.findOne({
      user: req.user.id,
      category: category.toLowerCase().trim(),
      month: month || new Date().toISOString().slice(0, 7),
    });
    if (existing) {
      return res.status(409).json({ message: 'Budget for this category/month already exists.' });
    }

    const budget = Budget.create({ user: req.user.id, category, limit, month });
    return res.status(201).json({ message: 'Budget created.', budget });
  } catch (err) {
    console.error('[HerPaisa] createBudget error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// PUT /api/herpaisa/budgets/:id
exports.updateBudget = (req, res) => {
  try {
    const budget = Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found.' });
    if (budget.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });

    const updates = {};
    if (req.body.limit !== undefined) updates.limit = Number(req.body.limit);
    if (req.body.category) updates.category = req.body.category.toLowerCase().trim();

    const updated = Budget.update(req.params.id, updates);
    return res.json({ message: 'Budget updated.', budget: updated });
  } catch (err) {
    console.error('[HerPaisa] updateBudget error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/herpaisa/budgets/:id
exports.deleteBudget = (req, res) => {
  try {
    const budget = Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found.' });
    if (budget.user !== req.user.id) return res.status(403).json({ message: 'Access denied.' });
    Budget.delete(req.params.id);
    return res.json({ message: 'Budget deleted.' });
  } catch (err) {
    console.error('[HerPaisa] deleteBudget error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  UPI PAYMENTS                                 ║
// ╚══════════════════════════════════════════════╝

// POST /api/herpaisa/pay/generate
exports.generatePaymentLink = (req, res) => {
  try {
    const { amount, note } = req.body;
    const paymentData = generateUPILink({ amount, note });
    return res.json({ message: 'Payment link generated.', payment: paymentData });
  } catch (err) {
    console.error('[HerPaisa] generatePaymentLink error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/herpaisa/pay/verify
exports.verifyPaymentStatus = async (req, res) => {
  try {
    const { txnRef, goalId, amount } = req.body;
    const result = await verifyPayment(txnRef);

    // If verified and linked to a savings goal, record the deposit
    if (result.verified && goalId) {
      const goal = SavingsGoal.findById(goalId);
      if (goal && goal.user === req.user.id) {
        SavingsGoal.addDeposit(goalId, amount, 'upi', txnRef);
        Transaction.create({
          user: req.user.id,
          type: 'income',
          category: 'savings',
          amount,
          note: `UPI deposit to: ${goal.name} (Ref: ${txnRef})`,
        });
      }
    }

    return res.json({ message: 'Payment verification result.', result });
  } catch (err) {
    console.error('[HerPaisa] verifyPayment error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ╔══════════════════════════════════════════════╗
// ║  FINANCIAL LITERACY                           ║
// ╚══════════════════════════════════════════════╝

// GET /api/herpaisa/tips
exports.getTips = (req, res) => {
  try {
    const { category } = req.query;
    const tips = getFinanceTips(category);
    return res.json({ tips });
  } catch (err) {
    console.error('[HerPaisa] getTips error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
