const express = require('express');
const { body, query } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const c = require('../controllers/herpaisaController');

const router = express.Router();

// All HerPaisa routes require authentication
router.use(authMiddleware);

// ── Savings Goals ──────────────────────────────
router.get('/goals', c.getGoals);

router.post(
  '/goals',
  [
    body('name').trim().notEmpty().withMessage('Goal name is required.'),
    body('targetAmount').isFloat({ min: 1 }).withMessage('Target amount must be at least 1.'),
    body('currency').optional().trim(),
  ],
  validate,
  c.createGoal
);

router.post(
  '/goals/:id/deposit',
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Deposit amount must be positive.'),
    body('method').optional().isIn(['manual', 'upi_gpay', 'upi_bharatpe', 'upi_phonepe']),
  ],
  validate,
  c.depositToGoal
);

router.delete('/goals/:id', c.deleteGoal);

// ── Transactions ───────────────────────────────
router.get('/transactions', c.getTransactions);

router.get('/transactions/summary', c.getTransactionSummary);

router.post(
  '/transactions',
  [
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense.'),
    body('category').optional().trim(),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive.'),
    body('note').optional().trim(),
    body('date').optional().isISO8601(),
  ],
  validate,
  c.createTransaction
);

router.delete('/transactions/:id', c.deleteTransaction);

// ── Budgets ────────────────────────────────────
router.get('/budgets', c.getBudgets);

router.post(
  '/budgets',
  [
    body('category').trim().notEmpty().withMessage('Category is required.'),
    body('limit').isFloat({ min: 1 }).withMessage('Budget limit must be at least 1.'),
    body('month')
      .optional()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage('Month format must be YYYY-MM.'),
  ],
  validate,
  c.createBudget
);

router.put(
  '/budgets/:id',
  [
    body('limit').optional().isFloat({ min: 1 }),
    body('category').optional().trim(),
  ],
  validate,
  c.updateBudget
);

router.delete('/budgets/:id', c.deleteBudget);

// ── UPI Payments ───────────────────────────────
router.post(
  '/pay/generate',
  [
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1.'),
    body('note').optional().trim(),
  ],
  validate,
  c.generatePaymentLink
);

router.post(
  '/pay/verify',
  [
    body('txnRef').trim().notEmpty().withMessage('Transaction reference is required.'),
    body('goalId').optional().trim(),
    body('amount').optional().isFloat({ min: 0.01 }),
  ],
  validate,
  c.verifyPaymentStatus
);

// ── Financial Tips ─────────────────────────────
router.get('/tips', c.getTips);

module.exports = router;
