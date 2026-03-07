import api from './api';

const herpaisaService = {
  // ── Savings Goals ──
  getGoals: () => api.get('/herpaisa/goals'),
  createGoal: (data) => api.post('/herpaisa/goals', data),
  depositToGoal: (goalId, data) => api.post(`/herpaisa/goals/${goalId}/deposit`, data),
  deleteGoal: (goalId) => api.delete(`/herpaisa/goals/${goalId}`),

  // ── Transactions ──
  getTransactions: (params) => api.get('/herpaisa/transactions', { params }),
  createTransaction: (data) => api.post('/herpaisa/transactions', data),
  getTransactionSummary: (params) => api.get('/herpaisa/transactions/summary', { params }),
  deleteTransaction: (id) => api.delete(`/herpaisa/transactions/${id}`),

  // ── Budgets ──
  getBudgets: (params) => api.get('/herpaisa/budgets', { params }),
  createBudget: (data) => api.post('/herpaisa/budgets', data),
  updateBudget: (id, data) => api.put(`/herpaisa/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/herpaisa/budgets/${id}`),

  // ── UPI Payments ──
  generatePaymentLink: (data) => api.post('/herpaisa/pay/generate', data),
  verifyPayment: (data) => api.post('/herpaisa/pay/verify', data),

  // ── Tips ──
  getTips: (category) => api.get('/herpaisa/tips', { params: { category } }),
};

export default herpaisaService;
